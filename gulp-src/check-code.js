// cSpell:ignore refcache

const gulp = require('gulp');
const through2 = require('through2');
const fs = require('fs').promises;
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const vm = require('vm');
const { taskArgs } = require('./_util');
const MarkdownIt = require('markdown-it');
const md = new MarkdownIt();
const tsMorph = require('@ts-morph/bootstrap');
const ts = require('typescript');
const JSON5 = require('json5');
const YAML = require('js-yaml');
const { error } = require('console');

const defaultGlob = '**/*.md';
const markdownFiles = [
  '!.github/**',
  '!content-modules/**',
  '!layouts/**',
  '!node_modules/**',
  '!scripts/registry-scanner/node_modules/**',
  '!themes/**',
  '!tmp/**',
];

let numFilesProcessed = 0,
  numFencesProcessed = 0,
  numFilesWithIssues = 0,
  numFencesWithIssues = 0;

const languageDenyList = {
  'bash': 'sh'
}

let languagesToCheck = '*'

const languageBuckets = {}

const codeCheckers = {
  'javascript': async (code, lineOffset, filename) => {
          // We have some sample code blocks with ... this way we turn them into comments
          code = code.replaceAll(/^\.\.\./g, '// ...');
          new vm.Script(code, { lineOffset, filename });
  },
  'json': async (code, lineOffset, filename) => {
    try {
      code = code.replace(/([}\]])\n([{\[])/gm, '$1,\n$2').replaceAll('undefined', '"undefined"')
      code = code.startsWith('"') ? `{${code}}` : `[${code}]`
      JSON5.parse(code)
    } catch (e) {
      console.log(code)
      e.message += ` in file ${filename}:${lineOffset}`
      throw (e)
    }
  },
  'python': async (code, lineOffset, filename) => {
    try {
      // python does not like empty blocks, we have some of them, fix it that way
      code = code.replaceAll('# something that might fail', 'print("something that might fail")')
      const cmd = `python3 \${PWD}/gulp-src/_code-check-helpers/check.py '${filename}' << ENDOFCODE\n${code}\ENDOFCODE\n`
      const { stdout, stderr } = await exec(cmd);
    } catch (e) {
      throw new Error(e.stderr.replaceAll('<string>', `${filename}:${lineOffset}`))
    }
  },
  'sh': async (code, lineOffset, filename) => {
    try {
      const cmd = `shellcheck -e SC2148,SC1091,2164 - << ENDOFCODE\n${code}\ENDOFCODE\n`
      const { stdout, stderr } = await exec(cmd);
    } catch(e) {
      throw new Error(e.stdout); // .replaceAll('In - line ', `In ${filename}:${lineOffset} line `));
    }
  },
  'typescript': async (code, lineOffset, filename) => {
    // We have some sample code blocks with ... this way we turn them into comments
    code = code.replaceAll(/^\.\.\./g, '// ...');
    if(!project) {
      project = await tsMorph.createProject({ useInMemoryFileSystem: true });
    }
    const file = project.createSourceFile(`${filename}.ts`, code);

    const program = project.createProgram();
    const diagnostics = ts.getPreEmitDiagnostics(program).filter(d => ![1378, 2307, 2304, 2468, 2552, 2580, 2705, 2712].includes(d.code));
    
    if(diagnostics.length > 0) {
      console.log(project.formatDiagnosticsWithColorAndContext(diagnostics));
    }

    project.removeSourceFile(`${filename}.ts`);

  },
  'yaml': async (code, lineOffset, filename) => {
    try {
      // We have some sample code blocks with ... this way we turn them into comments
      // We also have some incomplete YAML docs which we fix by adding a top level element yaml:
      code = 'yaml:\n' + code.replaceAll(/^\s*\.\.\./gm, '# ...').replaceAll('{{%', '').replaceAll('%}}', '');
      YAML.loadAll(code)
    } catch (e) {
      console.log(code)
      e.message += ` in file ${filename}:${lineOffset}`
      throw (e)
    }
  }
}

function parseOptions(optionsString) {
  if (!optionsString) return {}
  try {
    return JSON5.parse(optionsString.replaceAll('=', ':'))
  } catch (e) {
    return {}
  }
}

function checkLanguage(language, filename, lineOffset) {
  if (language.toLowerCase() !== language) {
    throw new Error(`Language "${language}" should be lowercase in ${filename}:${lineOffset}`)
  }
  if(Object.keys(languageDenyList).includes(language)) {
    throw new Error(`Language "${language}" should be "${languageDenyList[language]}" in ${filename}:${lineOffset}`)
  }
}

let project;

// This function will check the code for syntax errors, but will not execute it.
// It throws an error if there is a syntax error.
async function checkCode(language, code, lineOffset, filename) {
  if(languagesToCheck !== '*' && languagesToCheck.split(',').indexOf(language) === -1) {
    // We always run the default check to see if languages are named incorrectly (e.g. YAML instead of yaml)
    checkLanguage(language, filename, lineOffset)
    return
  }

  if (codeCheckers[language]) {
    await codeCheckers[language](code, lineOffset, filename)
  } else {
     checkLanguage(language, filename, lineOffset)
  }
}

async function checkCodeTask() {

  const argv = taskArgs().options({
    glob: {
      alias: 'g',
      type: 'string',
      description: 'Glob of files to run through markdownlint.',
      default: defaultGlob,
    },
    languages: {
      alias: 'l',
      type: 'string',
      description: 'Comma separated list of languages to check. Default is all.',
      default: languagesToCheck
    },
    withFiles: {
      alias: 'w',
      type: 'number',
      description: 'Show first n files when listing the fences. Default is 0 (no files).',
      default: 0
    }
  }).argv;

  languagesToCheck = argv.languages

  async function checkCodeFile(file, encoding, callback) {
    const fileContent = await fs.readFile(file.path, 'utf8');
    const errors = []
    md.parse(fileContent, {}).filter(token => token.type === 'fence').map(async token => {
      const code = token.content
      const line = token.map[0];
      const [language, optionsString] = token.info.split(/ (.*)/s)
      const options = parseOptions(optionsString)
      // languageBuckets[language] = languageBuckets[language] ? languageBuckets[language] + 1 : 1
      if(!languageBuckets[language]) {
        languageBuckets[language] = {
          files: [],
          numFences: 0
        }
      }
      languageBuckets[language].numFences++
      if(languageBuckets[language].files.indexOf(file.path) === -1) {
        languageBuckets[language].files.push(file.path)
      }

      if (options['check_code'] !== false) {
        try {
          numFencesProcessed++;
          await checkCode(language, code, line, file.path);
        } catch (e) {
          if (!e.message.startsWith('Cannot use import statement outside a module')) {
            numFencesWithIssues++;
            console.error(e.message);
            errors.push(e)
          }
        }
      }
    })
    numFilesProcessed++;
    if (errors.length > 0) {
      numFilesWithIssues++;
    }
    callback(null);
  }

  return gulp
    .src([argv.glob, ...markdownFiles])
    .pipe(through2.obj(checkCodeFile, () => {
      const fileOrFiles = 'file' + (numFilesProcessed == 1 ? '' : 's');
      const msg = `Processed ${numFilesProcessed} (${numFencesProcessed} fences) ${fileOrFiles}, ${numFilesWithIssues} (${numFencesWithIssues} fences) had issues.`;
      if (numFilesWithIssues > 0) {
        const e = new Error(`${msg} See above for details.`);
        throw (e)
      } else {
        console.log(msg);
      }
      Object.keys(languageBuckets).sort().forEach(language => {
        console.log(`${language}: ${languageBuckets[language].numFences} fences in ${languageBuckets[language].files.length} files`)
        if(argv.withFiles > 0) {
          languageBuckets[language].files.slice(0, argv.withFiles).forEach(file => console.log(`- ${file}`))
        }
      })
    }))
}

checkCodeTask.description = `syntax check code blocks in markdown files without executing them`;

gulp.task('check-code', checkCodeTask);

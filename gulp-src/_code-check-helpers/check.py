import sys

file_name = sys.argv[1]
source = ''

for line in sys.stdin:
    source += line

print(source)

compile(source, '<string>', 'exec')

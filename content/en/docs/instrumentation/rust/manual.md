---
title: Manual Instrumentation
linkTitle: Manual
weight: 30
description: Manual instrumentation for OpenTelemetry Rust
---

<!-- markdownlint-disable no-duplicate-heading -->

{{% docs/instrumentation/manual-intro %}}

## Example app preparation {#example-app}

This page uses a modified version of the example app from
[Getting Started](/docs/instrumentation/rust/getting-started/) to help you learn
about manual instrumentation.

You don't have to use the example app: if you want to instrument your own app or
library, follow the instructions here to adapt the process to your own code.

### Dependencies {#example-app-dependencies}

To begin, set up an environment in a new directory. Within
that directory, create a file called `Cargo.toml` with the following
content:

```toml
[package]
name = "dice_server"
version = "0.1.0"
edition = "2021"
publish = false

[[bin]]
name = "dice_server"
path = "dice_server.rs"
doc = false

[dependencies]
hyper = { version = "0.14", features = ["full"] }
tokio = { version = "1.29", features = ["full"] }
rand = { version = "0.8" }
```

### Create and launch an HTTP Server

To highlight the difference between instrumenting a _library_ and a standalone
_app_, split out the dice rolling into a _library_ class, which then will be
imported as a dependency by the app.

Create the _library file_ name `dice.rs` and add the following code to it:

```rust

```

Create the app files `dice_server.rs` and add the following code to them:

```rust
use hyper::service::{make_service_fn, service_fn};
use hyper::{Body, Request, Response, Server, Method, StatusCode};
use rand::Rng;
use std::{convert::Infallible, net::SocketAddr};

async fn handle(req: Request<Body>) -> Result<Response<Body>, Infallible> {
    let mut response = Response::new(Body::empty());

    match (req.method(), req.uri().path()) {
        (&Method::GET, "/rolldice") => {
            let random_number = rand::thread_rng().gen_range(1..7);
            *response.body_mut() = Body::from(random_number.to_string());
        }
        _ => {
            *response.status_mut() = StatusCode::NOT_FOUND;
        }
    };

    Ok(response)
}

#[tokio::main]
async fn main() {
    let addr = SocketAddr::from(([127, 0, 0, 1], 8080));

    let make_svc = make_service_fn(|_conn| async { Ok::<_, Infallible>(service_fn(handle)) });

    let server = Server::bind(&addr).serve(make_svc);

    println!("Listening on {addr}");
    if let Err(e) = server.await {
        eprintln!("server error: {e}");
    }
}
```

To ensure that it is working, run the application with the following command and
open <http://localhost:8080/rolldice?rolls=12> in your web browser:

```console
$ cargo run --bin dice_server
...
Listening on 127.0.0.1:8080
```

You should get a list of 12 numbers in your browser window, for example:

```text
[5,6,5,3,6,1
# inefficient

Load generation middleware to dynamically load CPU and memory.

By design, this code is extremely inefficient. Don't use this module on
production environments or leave it exposed on a public facing server
if you don't want to get a surprise bill or
suffer a trivial denial of service attack.

## Motivation

Used in non-production environments to verify Node.js memory limits and
Kubernetes horizontal pod autoscalers rules that rely on custom metrics based
on memory, cpu or average response times.


## Usage

Choose a hard to guess unique endpoint for the stress test

    export DANGEROUSLY_INEFICCIENT_ENDPOINT=_aNonGuessableInefficientEndpoint


Using a connect-compatible framework such as Express.js conditionally enable
the following middleware

    if (process.env.DANGEROUSLY_INEFICCIENT_ENDPOINT) {
      app.get(`/${process.env.DANGEROUSLY_INEFICCIENT_ENDPOINT}`, require('inefficient'));
    }

The using a tool like siege

Call

    siege -r 100 "http://localhost:3000/${DANGEROUSLY_INEFICCIENT_ENDPOINT}?memory=800"

to fill up to 800MB worth of RAM on each one of the nodes on your cluster

Call

    siege "http://localhost:3000/${DANGEROUSLY_INEFICCIENT_ENDPOINT}?cpu=1"

to generate CPU load. You can increment `cpu=` up to 10 at which point the
server will probably collapse or become extremely unresponsive.


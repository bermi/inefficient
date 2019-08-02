# inefficient

Load generation middleware to dynamically load CPU and memory via URL params.

By design, this code is extremely inefficient. Don't use this module on
production environments or leave it exposed on a public-facing server
if you don't want to get a surprise bill or
suffer a trivial denial of service attack.

## Motivation

Used in non-production environments to verify Node.js memory limits and
Kubernetes horizontal pod autoscalers rules that rely on custom metrics based
on memory, CPU, or average response times.


## Usage

Choose a hard to guess unique endpoint for the stress test:

    export DANGEROUSLY_INEFICCIENT_ENDPOINT=_aNonGuessableInefficientEndpoint


### Via a Node.js app

Using a connect-compatible framework such as Express.js conditionally enable
the following middleware

    if (process.env.DANGEROUSLY_INEFICCIENT_ENDPOINT) {
      app.get(
        `/${process.env.DANGEROUSLY_INEFICCIENT_ENDPOINT}`,
        require('inefficient')
      );
    }

### Via the public docker image

    docker run \
      -e "DANGEROUSLY_INEFICCIENT_ENDPOINT=${DANGEROUSLY_INEFICCIENT_ENDPOINT}" \
      -it --rm \
      -p 3000:3000 \
      bermi/inefficient

Then using a tool like siege:

    siege -r 100 \
      "http://localhost:3000/${DANGEROUSLY_INEFICCIENT_ENDPOINT}?memory=800"

to fill up to 800MB worth of RAM on each one of the nodes on your cluster call:

    siege "http://localhost:3000/${DANGEROUSLY_INEFICCIENT_ENDPOINT}?cpu=1"

to generate CPU load. You can increment `cpu=` up to 10 at which point the
server can collapse or become extremely unresponsive.

## URL parameters

The middleware allows parameterizing the memory and CPU-stress levels via the
following arguments.

### mbPerCall: number

Defines the amount of RAM to leak on every call until the limit determined by
the `memory` parameter.

Defaults to 1MB

### memory: number

The maximum memory to leak.

Defaults to 800MB

### cpu: number

Defines the number of chunks to take from the memory leaked array to
marshal/unmarshal to generate CPU load.

The CPU load originates from the following call:

    JSON.parse(JSON.stringify(global._memoryLeaker.slice(0, +cpu)))

Where `global._memoryLeaker`  contains an array of strings with their size
defined by the `mbPerCall` option.

A large `mbPerCall` and `cpu` results in long CPU blocking times and slower
response times.

Defaults to 0

### unleakMemory: boolean

Set to `true` go free up leaked memory.

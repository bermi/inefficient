// You'll need to `npm install polka` to run this demo
// or use the Docker version
const polka = require('polka');
const inefficient = require('./');

const {
  PORT = 3000,
  DANGEROUSLY_INEFICCIENT_ENDPOINT =
    `_inefficientEndpoint_${Math.random().toString(24).substr(-4)}`
} = process.env;

polka()
  .get(`/${DANGEROUSLY_INEFICCIENT_ENDPOINT}`, inefficient)
  .listen(PORT, err => {
    if (err) throw err;
    console.log(
      `> Inneficient endpoint ready on: http://localhost:${PORT}/${DANGEROUSLY_INEFICCIENT_ENDPOINT}`
    );
  });


const cluster = require('cluster');
const bullmq = require('bullmq');
const PdfJob = require('./pdf-job.js');

const QUEUE_NAME = process.env.QUEUE_NAME || 'work';

// Connect to a local redis instance locally, and the Heroku-provided URL in production
const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

// Spin up multiple processes to handle jobs to take advantage of more CPU cores
// See: https://devcenter.heroku.com/articles/node-concurrency for more info
const numWorkers = process.env.WEB_CONCURRENCY || 1;

// The maximum number of jobs each worker should process at once. This will need
// to be tuned for your application. If each job is mostly waiting on network
// responses it can be much higher. If each job is CPU-intensive, it might need
// to be much lower.
const maxJobsPerWorker = 50;


const { Worker } = bullmq;

if (cluster.isMaster) {
  for (let i = 0; i < numWorkers; i++) {
    cluster.fork();
  }

  cluster.on('exit', function (worker, code, signal) {
    console.log('worker ' + worker.process.pid + ' died');
  });
} else {
  const worker = new Worker(QUEUE_NAME, PdfJob);

  worker.on('error', err => {
    // log the error
    console.error(err);
  });
}

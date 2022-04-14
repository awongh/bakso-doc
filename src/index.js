const express = require('express');
const bullmq = require('bullmq');
const { Queue, QueueEvents } = bullmq;

const QUEUE_NAME = process.env.QUEUE_NAME || 'work';

// Serve on PORT on Heroku and on localhost:5000 locally
const PORT = process.env.PORT || '5000';

// Connect to a local redis intance locally, and the Heroku-provided URL in production
const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

const app = express();
app.use(express.json())

// Create / Connect to a named work queue
const workQueue = new Queue(QUEUE_NAME, REDIS_URL);

app.get('/test', async (req, res) => {

  const pageOptions = {
    width:500,
    height:500,
    timeout:200000,
  };

  const pdfOptions = {
    width:'500px',
    height:'500px',
    format:null,
    printBackground:true,
    path:'test.pdf'
  };

  const url = "http://info.cern.ch/";

  const params = {
    hookUrl:'test',
    renderUrl:url,
    pageOptions,
    pdfOptions,
  };

  const job = await workQueue.add(QUEUE_NAME, params,{ priority: 1});

  console.log(`job id: ${job.id}`);
  res.json({ id: job.id });
});

// Kick off a new job by adding it to the work queue
app.post('/job', async (req, res) => {
  const job = await workQueue.add(QUEUE_NAME, request.body.params,{ priority: req.body.priority});

  res.json({ id: job.id });
});

app.listen(PORT, () => console.log("Server started!"));

/*
 * ========================================================
 * ========================================================
 * ========================================================
 *
 *  Listen for queue eventas and log them here
 *
 * ========================================================
 * ========================================================
 * ========================================================
 */

const queueEvents = new QueueEvents(QUEUE_NAME);

queueEvents.on('completed', ({ jobId }) => {
  console.log('done painting');
});

queueEvents.on('failed', (j) => {
  console.error('error painting', j);
});

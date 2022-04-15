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

// Kick off a new job by adding it to the work queue
app.post('/job', async (req, res) => {
  const job = workQueue.add(QUEUE_NAME, req.body,{ priority: req.body.priority});

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

const amqp = require('amqplib');

let connection = null;
let channel = null;

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
const PDF_QUEUE = 'pdf_generation_queue';

/**
 * Connect to RabbitMQ server
 */
async function connect() {
  try {
    if (connection) {
      console.log('Already connected to RabbitMQ');
      return connection;
    }

    console.log('Connecting to RabbitMQ...');
    connection = await amqp.connect(RABBITMQ_URL);
    
    console.log('RabbitMQ connected successfully');

    // Handle connection errors
    connection.on('error', (err) => {
      console.error('RabbitMQ connection error:', err);
      connection = null;
      channel = null;
    });

    connection.on('close', () => {
      console.log('RabbitMQ connection closed');
      connection = null;
      channel = null;
    });

    return connection;
  } catch (error) {
    console.error('Failed to connect to RabbitMQ:', error);
    throw error;
  }
}

/**
 * Get or create a channel
 */
async function getChannel() {
  try {
    if (channel) {
      return channel;
    }

    if (!connection) {
      await connect();
    }

    console.log('Creating RabbitMQ channel...');
    channel = await connection.createChannel();

    // Assert the queue exists
    await channel.assertQueue(PDF_QUEUE, {
      durable: true, // Queue survives broker restart
      maxPriority: 10 // Enable priority queue
    });

    console.log(`Queue "${PDF_QUEUE}" ready`);

    return channel;
  } catch (error) {
    console.error('Failed to create channel:', error);
    throw error;
  }
}

/**
 * Send a message to the queue
 */
async function sendToQueue(queueName, message, options = {}) {
  try {
    const ch = await getChannel();
    const messageBuffer = Buffer.from(JSON.stringify(message));

    const defaultOptions = {
      persistent: true, // Message survives broker restart
      priority: options.priority || 5
    };

    ch.sendToQueue(queueName, messageBuffer, { ...defaultOptions, ...options });
    console.log(`Message sent to queue "${queueName}":`, message);
    
    return true;
  } catch (error) {
    console.error('Failed to send message to queue:', error);
    throw error;
  }
}

/**
 * Consume messages from the queue
 */
async function consumeQueue(queueName, callback, options = {}) {
  try {
    const ch = await getChannel();

    // Set prefetch to process one message at a time
    await ch.prefetch(options.prefetch || 1);

    console.log(`Waiting for messages in queue "${queueName}"...`);

    ch.consume(
      queueName,
      async (msg) => {
        if (msg) {
          try {
            const content = JSON.parse(msg.content.toString());
            console.log(`Received message from "${queueName}":`, content);

            // Execute the callback
            await callback(content, msg);

            // Acknowledge the message
            ch.ack(msg);
            console.log('Message processed and acknowledged');
          } catch (error) {
            console.error('Error processing message:', error);

            // Reject and requeue the message if processing fails
            if (options.requeue !== false) {
              ch.nack(msg, false, true);
              console.log('Message rejected and requeued');
            } else {
              ch.nack(msg, false, false);
              console.log('Message rejected without requeue');
            }
          }
        }
      },
      {
        noAck: false // Manual acknowledgment
      }
    );

    return ch;
  } catch (error) {
    console.error('Failed to consume queue:', error);
    throw error;
  }
}

/**
 * Close the connection
 */
async function close() {
  try {
    if (channel) {
      await channel.close();
      channel = null;
    }

    if (connection) {
      await connection.close();
      connection = null;
    }

    console.log('RabbitMQ connection closed');
  } catch (error) {
    console.error('Error closing RabbitMQ connection:', error);
  }
}

/**
 * Get queue statistics
 */
async function getQueueStats(queueName) {
  try {
    const ch = await getChannel();
    const queueInfo = await ch.checkQueue(queueName);
    
    return {
      queue: queueName,
      messageCount: queueInfo.messageCount,
      consumerCount: queueInfo.consumerCount
    };
  } catch (error) {
    console.error('Failed to get queue stats:', error);
    throw error;
  }
}

module.exports = {
  connect,
  getChannel,
  sendToQueue,
  consumeQueue,
  close,
  getQueueStats,
  PDF_QUEUE
};

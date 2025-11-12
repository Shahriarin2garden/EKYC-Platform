const rabbitmq = require('../config/rabbitmq');
const pdfService = require('./pdfService');
const Kyc = require('../models/Kyc');

/**
 * Start the PDF generation worker
 * This worker listens for PDF generation requests on RabbitMQ
 */
async function startPdfWorker() {
  try {
    console.log('Starting PDF Worker...');

    // Connect to RabbitMQ
    await rabbitmq.connect();

    // Start consuming messages from the PDF queue
    await rabbitmq.consumeQueue(
      rabbitmq.PDF_QUEUE,
      processPdfGenerationRequest,
      {
        prefetch: 1, // Process one PDF at a time
        requeue: true // Requeue failed messages
      }
    );

    console.log('PDF Worker started successfully');
    console.log(`Listening for PDF generation requests on queue: ${rabbitmq.PDF_QUEUE}`);
  } catch (error) {
    console.error('Failed to start PDF Worker:', error);
    throw error;
  }
}

/**
 * Process a PDF generation request
 * @param {Object} message - The message from RabbitMQ
 */
async function processPdfGenerationRequest(message) {
  const { kycId, requestedBy, priority } = message;

  console.log(`Processing PDF generation for KYC ID: ${kycId}`);
  console.log(`Requested by: ${requestedBy}, Priority: ${priority || 'normal'}`);

  try {
    // Fetch the KYC data from database
    const kycData = await Kyc.findById(kycId).populate('reviewedBy', 'name email');

    if (!kycData) {
      console.error(`KYC record not found: ${kycId}`);
      throw new Error('KYC record not found');
    }

    // Check if PDF already exists and is recent (less than 1 hour old)
    if (kycData.pdfPath && kycData.pdfGeneratedAt) {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      if (new Date(kycData.pdfGeneratedAt) > oneHourAgo) {
        console.log(`Recent PDF already exists for KYC ${kycId}, skipping generation`);
        return;
      }
    }

    // Generate the PDF
    console.log('Generating PDF...');
    const pdfPath = await pdfService.generateKycPdf(kycData);

    // Update the KYC record with PDF path
    kycData.pdfPath = pdfPath;
    kycData.pdfGeneratedAt = new Date();
    await kycData.save();

    console.log(`PDF generated successfully for KYC ${kycId}`);
    console.log(`PDF saved at: ${pdfPath}`);

    return {
      success: true,
      kycId,
      pdfPath,
      generatedAt: kycData.pdfGeneratedAt
    };

  } catch (error) {
    console.error(`Error generating PDF for KYC ${kycId}:`, error);
    
    // Log the error to database (optional)
    try {
      const kycData = await Kyc.findById(kycId);
      if (kycData) {
        kycData.pdfError = error.message;
        kycData.pdfErrorAt = new Date();
        await kycData.save();
      }
    } catch (dbError) {
      console.error('Failed to log PDF error to database:', dbError);
    }

    throw error;
  }
}

/**
 * Stop the PDF worker
 */
async function stopPdfWorker() {
  try {
    console.log('Stopping PDF Worker...');
    await rabbitmq.close();
    console.log('PDF Worker stopped');
  } catch (error) {
    console.error('Error stopping PDF Worker:', error);
  }
}

/**
 * Get worker statistics
 */
async function getWorkerStats() {
  try {
    const stats = await rabbitmq.getQueueStats(rabbitmq.PDF_QUEUE);
    return stats;
  } catch (error) {
    console.error('Error getting worker stats:', error);
    throw error;
  }
}

module.exports = {
  startPdfWorker,
  stopPdfWorker,
  getWorkerStats,
  processPdfGenerationRequest
};

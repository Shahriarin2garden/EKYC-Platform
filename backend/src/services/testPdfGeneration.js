const pdfService = require('./pdfService');
const Kyc = require('../models/Kyc');

/**
 * Test PDF Generation
 * This script tests the PDF generation functionality
 */

// Sample KYC data for testing
const sampleKycData = {
  _id: '64f9a8b7c1234567890abcde',
  name: 'John Doe',
  email: 'john.doe@example.com',
  nid: '1234567890',
  occupation: 'Software Engineer',
  address: '123 Main Street, Apt 4B, New York, NY 10001',
  status: 'approved',
  submittedAt: new Date('2024-11-01'),
  reviewedAt: new Date('2024-11-05'),
  reviewedBy: {
    name: 'Admin User',
    email: 'admin@example.com'
  },
  reviewNotes: 'All documents verified. Application approved.',
  aiSummary: 'This KYC application appears to be legitimate. The applicant has provided all necessary documentation including a valid National ID, proof of address, and employment verification. The information is consistent across all documents. The applicant has a clean background with no red flags. Recommendation: APPROVE'
};

async function testPdfGeneration() {
  try {
    console.log('Starting PDF generation test...\n');
    
    console.log('Test Data:');
    console.log('- Name:', sampleKycData.name);
    console.log('- Email:', sampleKycData.email);
    console.log('- Status:', sampleKycData.status);
    console.log('- NID:', sampleKycData.nid);
    console.log('\nGenerating PDF...');
    
    // Generate the PDF
    const pdfPath = await pdfService.generateKycPdf(sampleKycData);
    
    console.log('\n✓ PDF generated successfully!');
    console.log('✓ PDF saved at:', pdfPath);
    console.log('\nYou can open this PDF file to verify the output.');
    
    // Check if file exists
    const exists = pdfService.pdfExists(pdfPath);
    console.log('\nFile exists check:', exists ? '✓ YES' : '✗ NO');
    
    console.log('\nTest completed successfully! 🎉');
    
  } catch (error) {
    console.error('\n✗ Test failed!');
    console.error('Error:', error.message);
    console.error('\nStack trace:', error.stack);
    process.exit(1);
  }
}

// Run the test
console.log('========================================');
console.log('  PDF Generation Test');
console.log('========================================\n');

testPdfGeneration();

# PDF Generation with RabbitMQ - Implementation Guide

## Overview

This document describes the PDF generation system integrated with RabbitMQ for the EKYC application. The system allows admins to generate PDF reports for KYC applications asynchronously using a message queue architecture.

## Architecture

```
┌──────────────┐     Request PDF      ┌──────────────┐
│              │ ──────────────────►  │              │
│   Admin API  │                      │  RabbitMQ    │
│  (Producer)  │                      │    Queue     │
│              │ ◄────────────────────│              │
└──────────────┘     PDF Ready        └──────────────┘
                                              │
                                              │ Consume
                                              ▼
                                      ┌──────────────┐
                                      │              │
                                      │ PDF Worker   │
                                      │  (Consumer)  │
                                      │              │
                                      └──────────────┘
                                              │
                                              ▼
                                      ┌──────────────┐
                                      │  PDF Files   │
                                      │  (Storage)   │
                                      └──────────────┘
```

## Components

### 1. RabbitMQ Configuration (`src/config/rabbitmq.js`)
- Manages connection to RabbitMQ server
- Creates and manages the PDF generation queue
- Provides utilities for sending and consuming messages

### 2. PDF Service (`src/services/pdfService.js`)
- Generates PDF documents using PDFKit
- Formats KYC data into professional PDF reports
- Handles PDF file storage and management

### 3. PDF Producer (`src/services/pdfProducer.js`)
- Sends PDF generation requests to RabbitMQ queue
- Supports single and batch PDF generation
- Manages request priorities

### 4. PDF Worker (`src/services/pdfWorker.js`)
- Consumes messages from RabbitMQ queue
- Generates PDFs asynchronously
- Updates database with PDF status

### 5. Admin Controller (`src/controllers/adminController.js`)
- Provides API endpoints for PDF operations
- Handles PDF generation requests
- Manages PDF downloads

## Installation

### Prerequisites

1. **RabbitMQ Server**
   - Install RabbitMQ on your system
   - Default URL: `amqp://localhost:5672`

#### Windows Installation:
```powershell
# Using Chocolatey
choco install rabbitmq

# Or download from: https://www.rabbitmq.com/install-windows.html
```

#### macOS Installation:
```bash
brew install rabbitmq
```

#### Linux Installation:
```bash
sudo apt-get install rabbitmq-server
```

### Start RabbitMQ Service

**Windows:**
```powershell
# Start as service
rabbitmq-service start

# Or run in console
rabbitmq-server
```

**macOS/Linux:**
```bash
# Start as service
sudo systemctl start rabbitmq-server

# Or run directly
rabbitmq-server
```

### Install Dependencies

```bash
cd backend
npm install amqplib pdfkit
```

## Configuration

Add the following to your `.env` file:

```env
# RabbitMQ Configuration
RABBITMQ_URL=amqp://localhost:5672

# Optional: RabbitMQ with authentication
# RABBITMQ_URL=amqp://username:password@localhost:5672
```

## API Endpoints

### 1. Generate PDF for a KYC Application

**Endpoint:** `POST /api/admin/kyc/:kycId/generate-pdf`

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Body (Optional):**
```json
{
  "priority": 5
}
```

**Response:**
```json
{
  "success": true,
  "message": "PDF generation request queued successfully",
  "data": {
    "kycId": "64f9a8b7c1234567890abcde",
    "status": "queued",
    "message": "PDF is being generated. You can download it once it's ready."
  }
}
```

### 2. Download PDF

**Endpoint:** `GET /api/admin/kyc/:kycId/download-pdf`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:** PDF file download

### 3. Get PDF Status

**Endpoint:** `GET /api/admin/kyc/:kycId/pdf-status`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "message": "PDF status retrieved successfully",
  "data": {
    "kycId": "64f9a8b7c1234567890abcde",
    "pdfGenerated": true,
    "pdfPath": "/path/to/kyc_64f9a8b7c1234567890abcde_1699876543210.pdf",
    "generatedAt": "2024-11-12T10:30:00.000Z",
    "error": null,
    "errorAt": null
  }
}
```

### 4. Batch Generate PDFs

**Endpoint:** `POST /api/admin/kyc/batch-generate-pdf`

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Body:**
```json
{
  "kycIds": [
    "64f9a8b7c1234567890abcde",
    "64f9a8b7c1234567890abcdf",
    "64f9a8b7c1234567890abce0"
  ],
  "priority": 3
}
```

**Response:**
```json
{
  "success": true,
  "message": "Batch PDF generation request queued successfully",
  "data": {
    "total": 3,
    "successful": 3,
    "failed": 0,
    "errors": []
  }
}
```

### 5. Get Queue Status

**Endpoint:** `GET /api/admin/pdf-queue-status`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Queue status retrieved successfully",
  "data": {
    "queue": "pdf_generation_queue",
    "messageCount": 5,
    "consumerCount": 1
  }
}
```

## Priority Levels

The system supports priority-based PDF generation:

- **Priority 1-3:** Low priority (batch operations)
- **Priority 4-6:** Normal priority (default)
- **Priority 7-10:** High priority (urgent requests)

Higher priority messages are processed first.

## Usage Examples

### Using cURL

#### Generate PDF:
```bash
curl -X POST http://localhost:5000/api/admin/kyc/64f9a8b7c1234567890abcde/generate-pdf \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"priority": 8}'
```

#### Download PDF:
```bash
curl -X GET http://localhost:5000/api/admin/kyc/64f9a8b7c1234567890abcde/download-pdf \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  --output kyc_report.pdf
```

#### Check Status:
```bash
curl -X GET http://localhost:5000/api/admin/kyc/64f9a8b7c1234567890abcde/pdf-status \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Using JavaScript/Fetch

```javascript
// Generate PDF
async function generatePdf(kycId, priority = 5) {
  const response = await fetch(
    `http://localhost:5000/api/admin/kyc/${kycId}/generate-pdf`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ priority })
    }
  );
  return await response.json();
}

// Download PDF
async function downloadPdf(kycId) {
  const response = await fetch(
    `http://localhost:5000/api/admin/kyc/${kycId}/download-pdf`,
    {
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    }
  );
  
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `kyc_report_${kycId}.pdf`;
  a.click();
}

// Check Status
async function checkPdfStatus(kycId) {
  const response = await fetch(
    `http://localhost:5000/api/admin/kyc/${kycId}/pdf-status`,
    {
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    }
  );
  return await response.json();
}
```

## PDF Format

Generated PDFs include:

- **Header Section**
  - Application ID
  - Generation timestamp

- **Personal Information**
  - Full Name
  - Email Address
  - National ID (NID)
  - Occupation
  - Address

- **Application Status**
  - Current status (color-coded)
  - Submission date
  - Review information (if applicable)
  - Review notes

- **AI Summary** (if available)
  - AI-generated analysis of the application

- **Footer**
  - Document authenticity note

## Monitoring

### RabbitMQ Management UI

Access the RabbitMQ Management UI at: `http://localhost:15672`
- Username: `guest`
- Password: `guest`

### Check Queue Status

Use the API endpoint to monitor queue status:
```bash
curl -X GET http://localhost:5000/api/admin/pdf-queue-status \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

## Troubleshooting

### RabbitMQ Connection Errors

**Error:** `Failed to connect to RabbitMQ`

**Solutions:**
1. Ensure RabbitMQ is running
2. Check RABBITMQ_URL in .env file
3. Verify firewall settings

### PDF Generation Failures

**Error:** `Error generating PDF for KYC`

**Solutions:**
1. Check PDF directory permissions
2. Verify KYC data exists in database
3. Review worker logs for detailed errors

### Queue Not Processing

**Issue:** Messages remain in queue

**Solutions:**
1. Verify PDF Worker is running
2. Check worker logs for errors
3. Restart the application

## Performance Considerations

1. **Queue Prefetch:** Set to 1 to process one PDF at a time (prevents memory issues)
2. **Priority Queue:** Use priorities to handle urgent requests first
3. **Error Handling:** Failed messages are requeued for retry
4. **File Cleanup:** Consider implementing periodic cleanup of old PDF files

## Security

1. **Authentication:** All endpoints require admin authentication
2. **File Access:** PDFs are stored in a protected directory
3. **Download Control:** Only authenticated admins can download PDFs
4. **Data Privacy:** PDFs contain sensitive information - ensure proper access controls

## Future Enhancements

- [ ] Email notification when PDF is ready
- [ ] PDF template customization
- [ ] Automatic cleanup of old PDFs
- [ ] PDF watermarking
- [ ] Digital signatures
- [ ] PDF compression
- [ ] Multi-language support

## Support

For issues or questions:
1. Check the logs: `backend/logs/`
2. Review RabbitMQ Management UI
3. Contact system administrator

---

**Last Updated:** November 12, 2024
**Version:** 1.0.0

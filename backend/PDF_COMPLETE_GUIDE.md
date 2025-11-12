# EKYC PDF Generation - Complete Integration Guide

## 🎉 System Ready!

Your EKYC application now has a fully functional PDF generation system powered by RabbitMQ!

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Usage Examples](#usage-examples)
5. [Integration with Frontend](#integration-with-frontend)
6. [Testing](#testing)
7. [Deployment](#deployment)

## Prerequisites

Before using the PDF generation feature, ensure you have:

- ✅ Node.js installed (v14 or higher)
- ✅ MongoDB running
- ✅ RabbitMQ installed and running

## Installation

### Step 1: Install RabbitMQ

#### Windows (PowerShell as Administrator):
```powershell
# Run the automated setup script
cd backend
.\setup-rabbitmq.ps1
```

Or manually:
```powershell
choco install rabbitmq -y
rabbitmq-service start
```

#### macOS:
```bash
brew install rabbitmq
brew services start rabbitmq
```

#### Linux (Ubuntu/Debian):
```bash
sudo apt-get update
sudo apt-get install rabbitmq-server
sudo systemctl start rabbitmq-server
sudo systemctl enable rabbitmq-server
```

### Step 2: Enable RabbitMQ Management Plugin (Optional)

```bash
rabbitmq-plugins enable rabbitmq_management
```

Access the management UI at: http://localhost:15672
- Username: `guest`
- Password: `guest`

### Step 3: Install Node Dependencies

```bash
cd backend
npm install
```

## Configuration

### Environment Variables

Add to your `.env` file in the `backend` directory:

```env
# RabbitMQ Configuration
RABBITMQ_URL=amqp://localhost:5672

# For production with authentication:
# RABBITMQ_URL=amqp://username:password@hostname:5672

# MongoDB Configuration (existing)
MONGODB_URI=mongodb://localhost:27017/ekyc

# JWT Configuration (existing)
JWT_SECRET=your_jwt_secret_key_here

# Server Configuration (existing)
PORT=5000
NODE_ENV=development

# Frontend URL (existing)
FRONTEND_URL=http://localhost:3000
```

### Verify Configuration

```bash
# Check if RabbitMQ is running
rabbitmqctl status

# Or visit management UI
# http://localhost:15672
```

## Usage Examples

### Example 1: Generate PDF for Single KYC Application

```bash
# Login as admin first
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "your_password"
  }'

# Save the token from response
TOKEN="your_jwt_token_here"

# Request PDF generation
curl -X POST http://localhost:5000/api/admin/kyc/KYC_ID/generate-pdf \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "priority": 5
  }'
```

### Example 2: Check PDF Status

```bash
curl -X GET http://localhost:5000/api/admin/kyc/KYC_ID/pdf-status \
  -H "Authorization: Bearer $TOKEN"
```

**Response:**
```json
{
  "success": true,
  "message": "PDF status retrieved successfully",
  "data": {
    "kycId": "64f9a8b7c1234567890abcde",
    "pdfGenerated": true,
    "pdfPath": "/path/to/pdf",
    "generatedAt": "2024-11-12T10:30:00.000Z",
    "error": null,
    "errorAt": null
  }
}
```

### Example 3: Download PDF

```bash
curl -X GET http://localhost:5000/api/admin/kyc/KYC_ID/download-pdf \
  -H "Authorization: Bearer $TOKEN" \
  --output kyc_report.pdf
```

### Example 4: Batch Generate PDFs

```bash
curl -X POST http://localhost:5000/api/admin/kyc/batch-generate-pdf \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "kycIds": [
      "64f9a8b7c1234567890abcde",
      "64f9a8b7c1234567890abcdf",
      "64f9a8b7c1234567890abce0"
    ],
    "priority": 3
  }'
```

### Example 5: Check Queue Status

```bash
curl -X GET http://localhost:5000/api/admin/pdf-queue-status \
  -H "Authorization: Bearer $TOKEN"
```

## Integration with Frontend

### React/TypeScript Integration

#### 1. Update API Service (`frontend/src/services/api.ts`)

```typescript
// PDF Generation APIs
export const generatePdf = async (kycId: string, priority: number = 5) => {
  const response = await api.post(
    `/admin/kyc/${kycId}/generate-pdf`,
    { priority }
  );
  return response.data;
};

export const downloadPdf = async (kycId: string) => {
  const response = await api.get(
    `/admin/kyc/${kycId}/download-pdf`,
    { responseType: 'blob' }
  );
  
  // Create download link
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `kyc_report_${kycId}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  
  return response.data;
};

export const getPdfStatus = async (kycId: string) => {
  const response = await api.get(`/admin/kyc/${kycId}/pdf-status`);
  return response.data;
};

export const batchGeneratePdf = async (kycIds: string[], priority: number = 3) => {
  const response = await api.post('/admin/kyc/batch-generate-pdf', {
    kycIds,
    priority
  });
  return response.data;
};

export const getPdfQueueStatus = async () => {
  const response = await api.get('/admin/pdf-queue-status');
  return response.data;
};
```

#### 2. Create PDF Button Component

```typescript
// frontend/src/components/PdfButton.tsx
import React, { useState } from 'react';
import { generatePdf, downloadPdf, getPdfStatus } from '../services/api';

interface PdfButtonProps {
  kycId: string;
}

export const PdfButton: React.FC<PdfButtonProps> = ({ kycId }) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>('');

  const handleGenerate = async () => {
    try {
      setLoading(true);
      setStatus('Requesting PDF generation...');
      
      await generatePdf(kycId, 5);
      setStatus('PDF generation queued. Checking status...');
      
      // Poll for status
      const checkStatus = setInterval(async () => {
        const result = await getPdfStatus(kycId);
        
        if (result.data.pdfGenerated) {
          clearInterval(checkStatus);
          setStatus('PDF ready! Downloading...');
          await handleDownload();
        }
      }, 2000);
      
      // Stop polling after 30 seconds
      setTimeout(() => {
        clearInterval(checkStatus);
        setStatus('PDF generation in progress. Please check back later.');
        setLoading(false);
      }, 30000);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      setStatus('Error generating PDF');
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      await downloadPdf(kycId);
      setStatus('PDF downloaded successfully!');
      setLoading(false);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      setStatus('Error downloading PDF');
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="btn-primary"
      >
        {loading ? 'Generating...' : 'Generate PDF'}
      </button>
      {status && <p className="status-text">{status}</p>}
    </div>
  );
};
```

#### 3. Use in Admin Dashboard

```typescript
// frontend/src/pages/AdminDashboard.tsx
import { PdfButton } from '../components/PdfButton';

// In your KYC list render:
<div className="kyc-actions">
  <PdfButton kycId={kyc._id} />
  {/* Other action buttons */}
</div>
```

## Testing

### 1. Test PDF Generation Directly

```bash
cd backend
node src/services/testPdfGeneration.js
```

Expected output:
```
========================================
  PDF Generation Test
========================================

Starting PDF generation test...

Test Data:
- Name: John Doe
- Email: john.doe@example.com
- Status: approved
- NID: 1234567890

Generating PDF...

✓ PDF generated successfully!
✓ PDF saved at: C:\...\backend\pdfs\kyc_*.pdf

Test completed successfully! 🎉
```

### 2. Test with Real Data

1. Start the backend server:
   ```bash
   npm start
   ```

2. Submit a KYC application
3. Login as admin
4. Request PDF generation via API
5. Check status and download

### 3. Monitor RabbitMQ

Visit http://localhost:15672 to monitor:
- Queue messages
- Consumer status
- Message rates
- Error rates

## Deployment

### Production Considerations

#### 1. RabbitMQ Authentication

Update `.env`:
```env
RABBITMQ_URL=amqp://username:password@rabbitmq-server:5672
```

#### 2. RabbitMQ Cluster (Optional)

For high availability:
```env
RABBITMQ_URL=amqp://user:pass@node1:5672,node2:5672,node3:5672
```

#### 3. Environment Variables

Set in production:
```env
NODE_ENV=production
RABBITMQ_URL=amqp://production_user:secure_password@rabbitmq.example.com:5672
```

#### 4. File Storage

Consider using cloud storage for PDFs:
- AWS S3
- Azure Blob Storage
- Google Cloud Storage

#### 5. Monitoring

Set up monitoring for:
- RabbitMQ queue length
- PDF generation success rate
- Worker health
- Disk space (for PDF storage)

### Docker Deployment

#### docker-compose.yml (Add RabbitMQ service)

```yaml
services:
  rabbitmq:
    image: rabbitmq:3-management
    ports:
      - "5672:5672"
      - "15672:15672"
    environment:
      - RABBITMQ_DEFAULT_USER=admin
      - RABBITMQ_DEFAULT_PASS=secure_password
    volumes:
      - rabbitmq_data:/var/lib/rabbitmq

  backend:
    build: ./backend
    depends_on:
      - mongodb
      - rabbitmq
    environment:
      - RABBITMQ_URL=amqp://admin:secure_password@rabbitmq:5672

volumes:
  rabbitmq_data:
```

## Troubleshooting

### Issue: RabbitMQ Connection Failed

**Error:** `Failed to connect to RabbitMQ`

**Solutions:**
1. Check if RabbitMQ is running: `rabbitmqctl status`
2. Verify RABBITMQ_URL in .env
3. Check firewall settings
4. Ensure port 5672 is accessible

### Issue: PDF Not Generating

**Error:** `Error generating PDF for KYC`

**Solutions:**
1. Check backend logs
2. Verify PDF Worker is running (should see "PDF Worker started" in logs)
3. Check RabbitMQ queue has messages
4. Ensure `pdfs/` directory exists and is writable
5. Verify KYC data exists in database

### Issue: Slow PDF Generation

**Solutions:**
1. Increase number of workers (run multiple instances)
2. Increase prefetch count in worker
3. Check system resources (CPU, memory)
4. Optimize PDF generation code

### Issue: Queue Growing Too Large

**Solutions:**
1. Add more workers
2. Increase worker processing speed
3. Implement queue length limits
4. Add alerting for queue length

## Best Practices

### 1. Priority Management
- Use high priority (7-10) for urgent requests
- Use normal priority (4-6) for regular requests
- Use low priority (1-3) for batch operations

### 2. Error Handling
- Monitor failed messages
- Implement dead letter queue for repeatedly failing messages
- Log all errors for debugging

### 3. Resource Management
- Implement PDF cleanup policy (delete old PDFs)
- Monitor disk space
- Set queue size limits

### 4. Security
- Always use authentication in production
- Encrypt sensitive data in PDFs
- Implement access controls
- Use HTTPS for API endpoints

### 5. Monitoring
- Set up alerts for queue length
- Monitor PDF generation success rate
- Track processing time
- Monitor system resources

## Additional Resources

- [PDF Generation Guide](./PDF_GENERATION_GUIDE.md) - Comprehensive guide
- [Quick Start](./PDF_QUICKSTART.md) - Quick setup guide
- [Implementation Summary](./PDF_IMPLEMENTATION_SUMMARY.md) - Technical details
- [RabbitMQ Documentation](https://www.rabbitmq.com/documentation.html)
- [PDFKit Documentation](https://pdfkit.org/)

## Support

For issues or questions:
1. Check the logs in `backend/logs/`
2. Review RabbitMQ Management UI at http://localhost:15672
3. Check the documentation files
4. Review error messages in console

---

**Last Updated:** November 12, 2024  
**Version:** 1.0.0  
**Status:** Production Ready ✅

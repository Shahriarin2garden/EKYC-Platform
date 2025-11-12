# PDF Generation with RabbitMQ - Quick Start

## Quick Setup

### 1. Install RabbitMQ

**Windows (PowerShell as Administrator):**
```powershell
# Run the setup script
.\setup-rabbitmq.ps1

# Or manually with Chocolatey
choco install rabbitmq -y
```

**macOS:**
```bash
brew install rabbitmq
brew services start rabbitmq
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install rabbitmq-server
sudo systemctl start rabbitmq-server
sudo systemctl enable rabbitmq-server
```

### 2. Enable Management Plugin (Optional)

```bash
rabbitmq-plugins enable rabbitmq_management
```

Access UI: http://localhost:15672 (guest/guest)

### 3. Configure Environment

Add to your `.env` file:
```env
RABBITMQ_URL=amqp://localhost:5672
```

### 4. Start the Server

```bash
npm start
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/kyc/:kycId/generate-pdf` | Request PDF generation |
| GET | `/api/admin/kyc/:kycId/download-pdf` | Download generated PDF |
| GET | `/api/admin/kyc/:kycId/pdf-status` | Check PDF status |
| POST | `/api/admin/kyc/batch-generate-pdf` | Batch generate PDFs |
| GET | `/api/admin/pdf-queue-status` | Get queue statistics |

## Quick Test

```bash
# Generate PDF (replace TOKEN and KYC_ID)
curl -X POST http://localhost:5000/api/admin/kyc/KYC_ID/generate-pdf \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"priority": 5}'

# Check status
curl -X GET http://localhost:5000/api/admin/kyc/KYC_ID/pdf-status \
  -H "Authorization: Bearer TOKEN"

# Download PDF
curl -X GET http://localhost:5000/api/admin/kyc/KYC_ID/download-pdf \
  -H "Authorization: Bearer TOKEN" \
  --output report.pdf
```

## Architecture

```
Admin Request → RabbitMQ Queue → PDF Worker → Generate PDF → Store File
```

## Key Features

✅ **Asynchronous Processing** - PDFs generated in background  
✅ **Priority Queue** - Handle urgent requests first  
✅ **Error Handling** - Failed jobs are requeued  
✅ **Batch Operations** - Generate multiple PDFs at once  
✅ **Professional Format** - Clean, formatted PDF reports  
✅ **Status Tracking** - Monitor generation progress  

## File Structure

```
backend/
├── pdfs/                          # Generated PDF files
├── src/
│   ├── config/
│   │   └── rabbitmq.js           # RabbitMQ configuration
│   ├── services/
│   │   ├── pdfService.js         # PDF generation logic
│   │   ├── pdfWorker.js          # RabbitMQ consumer
│   │   └── pdfProducer.js        # RabbitMQ producer
│   ├── controllers/
│   │   └── adminController.js    # PDF API endpoints
│   └── models/
│       └── Kyc.js                # Updated with PDF fields
└── PDF_GENERATION_GUIDE.md       # Detailed documentation
```

## Troubleshooting

**RabbitMQ not connecting?**
- Check if RabbitMQ service is running
- Verify RABBITMQ_URL in .env
- Check firewall settings

**PDF not generating?**
- Check backend logs
- Verify PDF Worker is running
- Check RabbitMQ queue status

**Permission errors?**
- Ensure pdfs/ directory exists
- Check write permissions

## More Information

See [PDF_GENERATION_GUIDE.md](./PDF_GENERATION_GUIDE.md) for complete documentation.

---

**Need Help?** Check the logs or RabbitMQ Management UI at http://localhost:15672

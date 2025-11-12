# PDF Generation - Quick Start & Testing Guide

## 🚀 Quick Test (Without RabbitMQ)

The PDF generation service works even without RabbitMQ! You can test the PDF generation directly.

### Test 1: Direct PDF Generation Test

```powershell
cd backend
node src/services/testPdfGeneration.js
```

**Expected Output:**
```
✓ PDF generated successfully!
✓ PDF saved at: C:\...\backend\pdfs\kyc_*.pdf
Test completed successfully! 🎉
```

**Result:** ✅ PDF generation works! Check `backend/pdfs/` folder for the generated PDF.

---

## 🎯 Full System Test (With UI)

### Step 1: Start Backend Server

```powershell
cd backend
npm start
```

**Note:** Server will start even without RabbitMQ. You'll see:
```
EKYC API Server running on port 5000
Failed to start PDF Worker: Connection refused
PDF generation will not be available. Make sure RabbitMQ is running.
```

This is OK! The API endpoints still work, but PDFs will be generated synchronously instead of via queue.

### Step 2: Start Frontend

```powershell
cd frontend
npm start
```

### Step 3: Test PDF Generation via UI

1. **Login as Admin**
   - Go to: http://localhost:3000/admin
   - Login with your admin credentials

2. **Generate PDF**
   - In the Admin Dashboard, you'll see a new **PDF button** (purple/pink) for each KYC application
   - Click the PDF button (document icon) to generate a PDF
   - The button will show a loading spinner
   - Once generated, the button changes to a download icon (purple)

3. **Download PDF**
   - Click the download button (purple) to download the generated PDF
   - PDF will be saved as `kyc_report_[ID].pdf`

---

## 🐰 Full Test (With RabbitMQ) - Optional

For production-grade asynchronous PDF generation:

### Step 1: Install RabbitMQ

**Windows (PowerShell as Administrator):**
```powershell
# Option 1: Using Chocolatey
choco install rabbitmq -y

# Option 2: Run setup script
cd backend
.\setup-rabbitmq.ps1
```

**Verify Installation:**
```powershell
rabbitmqctl status
```

### Step 2: Start RabbitMQ

```powershell
rabbitmq-server
```

Or as a service:
```powershell
rabbitmq-service start
```

### Step 3: Update .env

Add to `backend/.env`:
```env
RABBITMQ_URL=amqp://localhost:5672
```

### Step 4: Start Backend

```powershell
cd backend
npm start
```

**Expected Output:**
```
EKYC API Server running on port 5000
Connecting to RabbitMQ...
RabbitMQ connected successfully
PDF Worker started successfully
Listening for PDF generation requests on queue: pdf_generation_queue
```

### Step 5: Test via UI

Same as above - but now PDFs are generated asynchronously in the background!

---

## 🧪 Test Scenarios

### Scenario 1: Generate PDF for Single Application

1. Login to Admin Dashboard
2. Find any KYC application
3. Click the **PDF button** (document icon)
4. Wait for generation (2-5 seconds)
5. Button changes to download icon
6. Click to download PDF

### Scenario 2: Generate Multiple PDFs

1. Generate PDFs for multiple applications
2. Each one queues independently
3. Download them as they become ready

### Scenario 3: Download Existing PDF

1. If PDF already exists (button is purple/download icon)
2. Click to download immediately
3. No generation needed!

---

## 📊 Monitoring

### Check Queue Status (If RabbitMQ is running)

Visit RabbitMQ Management UI:
- **URL:** http://localhost:15672
- **Username:** `guest`
- **Password:** `guest`

Or via API:
```bash
curl -X GET http://localhost:5000/api/admin/pdf-queue-status \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Check PDF Status for Application

```bash
curl -X GET http://localhost:5000/api/admin/kyc/KYC_ID/pdf-status \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🎨 UI Features

### PDF Button States

1. **Gray Spinner** - Checking PDF status
2. **Purple/Indigo Document Icon** - PDF not generated yet (click to generate)
3. **Purple/Pink Download Icon** - PDF ready (click to download)
4. **Loading Spinner** - Generating or downloading in progress

### Button Tooltips

- Hover over the button to see its status
- Shows generation timestamp for existing PDFs

---

## ✅ Success Indicators

### Backend Console:
```
PDF generated successfully: kyc_ID_timestamp.pdf
✓ PDF generated successfully!
```

### Frontend:
- Green notification: "PDF action completed successfully!"
- Button changes from document icon to download icon
- Tooltip shows generation time

### File System:
- Check `backend/pdfs/` folder
- PDF file created: `kyc_[ID]_[timestamp].pdf`

---

## 🔧 Troubleshooting

### Issue: PDF Button Not Showing

**Solution:** 
- Clear browser cache
- Refresh the page
- Check console for errors

### Issue: "Failed to generate PDF"

**Solutions:**
1. Check backend server is running
2. Check you're logged in as admin
3. Verify KYC application exists
4. Check backend logs for errors

### Issue: PDF Downloads Empty File

**Solutions:**
1. Wait a few seconds and try downloading again
2. Generate the PDF again
3. Check backend logs for generation errors

### Issue: RabbitMQ Connection Failed

**This is OK!** The system works without RabbitMQ too.
- PDFs generate synchronously
- Slightly slower but fully functional
- For production, install RabbitMQ for async processing

---

## 📝 Testing Checklist

- [ ] Backend starts successfully
- [ ] Frontend starts successfully
- [ ] Can login to Admin Dashboard
- [ ] PDF button appears in actions column
- [ ] Can click "Generate PDF" button
- [ ] Button shows loading state
- [ ] Button changes to download icon after generation
- [ ] Can download PDF file
- [ ] PDF opens and shows correct information
- [ ] Can generate PDFs for multiple applications
- [ ] Downloaded PDFs have correct naming

---

## 🎉 What to Expect

### Generated PDF Contains:
- ✅ Application ID and generation date
- ✅ Personal information (name, email, NID, occupation, address)
- ✅ Application status (color-coded)
- ✅ Submission and review timestamps
- ✅ AI-generated summary (if available)
- ✅ Review notes (if available)
- ✅ Professional formatting with borders and styling

### Sample PDF Name:
`kyc_report_64f9a8b7c1234567890abcde.pdf`

---

## 🚀 Ready to Test!

1. **Quick Test:** Run `node src/services/testPdfGeneration.js`
2. **UI Test:** Start backend & frontend, login, click PDF button
3. **Full Test:** Install RabbitMQ, configure, and test async generation

**Everything should work smoothly! Happy testing! 🎊**

---

## 💡 Tips

- **First Time:** Generate a PDF to test the feature
- **Multiple Apps:** Try generating several PDFs at once
- **Re-download:** PDFs are cached, re-downloading is instant
- **Status Check:** Hover over button to see last generation time
- **Queue Monitor:** Use RabbitMQ UI to watch messages flow

---

**For detailed documentation, see:**
- `backend/PDF_COMPLETE_GUIDE.md`
- `backend/PDF_GENERATION_GUIDE.md`
- `INTEGRATION_COMPLETE.md`

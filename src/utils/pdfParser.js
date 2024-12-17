const { PDFDocument } = require('pdf-lib');
const fs = require('fs');

async function extractTextFromPDF(filePath) {
  const pdfBuffer = fs.readFileSync(filePath);
  const pdfDoc = await PDFDocument.load(pdfBuffer);
  const numPages = pdfDoc.getPageCount();
  let extractedText = '';

  for (let i = 0; i < numPages; i++) {
    const page = pdfDoc.getPage(i);
    const textContent = await page.getTextContent();
    extractedText += textContent;
  }

  return extractedText;
}

module.exports = { extractTextFromPDF };

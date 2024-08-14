
import { PDFDocument } from 'pdf-lib';

export async function getPdfTitle(pdfUrl) {
  try {
    const response = await fetch(pdfUrl);
    const arrayBuffer = await response.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);

    const metadata = pdfDoc.getMetadata();
    return metadata ? metadata.title || 'Untitled' : 'Untitled';
  } catch (error) {
    console.error('Error extracting PDF title:', error);
    return 'Untitled';
  }
}

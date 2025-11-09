/**
 * Utility functions for exporting whiteboard canvas
 * Supports PNG and PDF export formats
 */

/**
 * Export canvas as PNG image
 * @param {Object} fabricCanvas - Fabric.js canvas instance
 * @param {string} filename - Filename for the exported image (default: 'whiteboard.png')
 */
export const exportAsPNG = (fabricCanvas, filename = 'whiteboard.png') => {
  if (!fabricCanvas) {
    console.error('Canvas not available for export');
    return;
  }

  try {
    // Convert canvas to data URL
    const dataURL = fabricCanvas.toDataURL({
      format: 'png',
      quality: 1.0,
      multiplier: 2, // Higher resolution
    });

    // Create download link
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = filename;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Failed to export as PNG:', error);
    throw error;
  }
};

/**
 * Export canvas as PDF document
 * @param {Object} fabricCanvas - Fabric.js canvas instance
 * @param {string} filename - Filename for the exported PDF (default: 'whiteboard.pdf')
 */
export const exportAsPDF = async (fabricCanvas, filename = 'whiteboard.pdf') => {
  if (!fabricCanvas) {
    console.error('Canvas not available for export');
    return;
  }

  try {
    // Convert canvas to data URL
    const dataURL = fabricCanvas.toDataURL({
      format: 'png',
      quality: 1.0,
      multiplier: 2,
    });

    // Create a simple PDF using canvas image
    // For a more robust solution, consider using jsPDF library
    // For now, we'll create a basic PDF-like structure
    
    // Get canvas dimensions
    const width = fabricCanvas.width;
    const height = fabricCanvas.height;

    // Create an image element
    const img = new Image();
    img.src = dataURL;

    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });

    // Create a new canvas for PDF generation
    const pdfCanvas = document.createElement('canvas');
    const ctx = pdfCanvas.getContext('2d');
    
    // Set PDF page size (A4 proportions)
    const pdfWidth = 1240;
    const pdfHeight = 1754;
    pdfCanvas.width = pdfWidth;
    pdfCanvas.height = pdfHeight;

    // Fill white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, pdfWidth, pdfHeight);

    // Calculate scaling to fit image on page
    const scale = Math.min(
      (pdfWidth - 40) / width,
      (pdfHeight - 40) / height
    );
    const scaledWidth = width * scale;
    const scaledHeight = height * scale;
    const x = (pdfWidth - scaledWidth) / 2;
    const y = (pdfHeight - scaledHeight) / 2;

    // Draw image on PDF canvas
    ctx.drawImage(img, x, y, scaledWidth, scaledHeight);

    // Convert to blob and download
    pdfCanvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
    }, 'image/png');

  } catch (error) {
    console.error('Failed to export as PDF:', error);
    throw error;
  }
};

/**
 * Export canvas in specified format
 * @param {Object} fabricCanvas - Fabric.js canvas instance
 * @param {string} format - Export format ('png' or 'pdf')
 * @param {string} filename - Filename for the exported file
 */
export const exportWhiteboard = async (fabricCanvas, format = 'png', filename = null) => {
  const defaultFilename = `whiteboard-${Date.now()}.${format}`;
  const exportFilename = filename || defaultFilename;

  switch (format.toLowerCase()) {
    case 'png':
      exportAsPNG(fabricCanvas, exportFilename);
      break;
    case 'pdf':
      await exportAsPDF(fabricCanvas, exportFilename);
      break;
    default:
      console.error(`Unsupported export format: ${format}`);
      throw new Error(`Unsupported export format: ${format}`);
  }
};

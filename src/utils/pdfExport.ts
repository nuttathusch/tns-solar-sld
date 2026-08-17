import jsPDF from 'jspdf';

export async function exportSvgToPdf(
  svgElement: SVGSVGElement,
  filename: string = 'TNS-Solar-SLD.pdf',
  paperSize: 'A3' | 'A4' = 'A3'
): Promise<void> {
  try {
    // Standard dimensions (in mm)
    // A3 Landscape: 420mm x 297mm
    // A4 Landscape: 297mm x 210mm
    const isA3 = paperSize === 'A3';
    const pdfWidthMm = isA3 ? 420 : 297;
    const pdfHeightMm = isA3 ? 297 : 210;

    // Serialize SVG to XML string
    const serializer = new XMLSerializer();
    let svgString = serializer.serializeToString(svgElement);

    // Fix namespace and styles
    if (!svgString.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
      svgString = svgString.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }

    // Convert SVG to high-resolution Image on Canvas
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = () => resolve(null);
      img.onerror = (e) => reject(e);
      img.src = url;
    });

    // Render onto 4x Super-Sampled Canvas for crisp vector-like sharpness
    const scale = 3;
    const canvas = document.createElement('canvas');
    canvas.width = 1360 * scale;
    canvas.height = 920 * scale;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Unable to get canvas context');
    }

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    URL.revokeObjectURL(url);

    const imgData = canvas.toDataURL('image/jpeg', 0.98);

    // Create jsPDF document
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: isA3 ? 'a3' : 'a4',
      compress: true,
    });

    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidthMm, pdfHeightMm, undefined, 'FAST');
    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    // Fallback: Trigger standard browser print
    window.print();
  }
}

export function exportSvgToFile(svgElement: SVGSVGElement, filename: string = 'TNS-Solar-SLD.svg'): void {
  const serializer = new XMLSerializer();
  let svgString = serializer.serializeToString(svgElement);
  if (!svgString.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
    svgString = svgString.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
  }

  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

import jsPDF from 'jspdf';

export async function exportSvgToPdf(
  svgElement: SVGSVGElement,
  filename: string = 'TNS-Solar-SLD.pdf',
  paperSize: 'A3' | 'A4' = 'A3'
): Promise<void> {
  const isA3 = paperSize === 'A3';
  const pdfWidthMm = isA3 ? 420 : 297;
  const pdfHeightMm = isA3 ? 297 : 210;

  try {
    // Clone SVG node to manipulate attributes safely
    const clone = svgElement.cloneNode(true) as SVGSVGElement;
    clone.setAttribute('width', '1360');
    clone.setAttribute('height', '920');
    clone.setAttribute('viewBox', '0 0 1360 920');
    clone.style.backgroundColor = '#ffffff';

    // Serialize to XML string
    const serializer = new XMLSerializer();
    let svgString = serializer.serializeToString(clone);

    if (!svgString.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
      svgString = svgString.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }

    // Convert SVG to Blob URL
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.crossOrigin = 'anonymous';

    await new Promise((resolve, reject) => {
      img.onload = () => resolve(null);
      img.onerror = (e) => {
        console.error('Image load error on SVG conversion', e);
        reject(e);
      };
      img.src = url;
    });

    // High resolution canvas (3x scale = 4080 x 2760 px) for crisp engineering lines
    const scale = 3;
    const canvas = document.createElement('canvas');
    canvas.width = 1360 * scale;
    canvas.height = 920 * scale;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Unable to get canvas 2D context');
    }

    // Fill pure white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    URL.revokeObjectURL(url);

    // Use PNG for pixel-perfect loss-less line sharpness
    const imgData = canvas.toDataURL('image/png');

    // Create jsPDF document in exact landscape dimensions
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: isA3 ? 'a3' : 'a4',
      compress: true,
    });

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidthMm, pdfHeightMm, undefined, 'SLOW');
    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    // Fallback: Trigger standard browser print with print styles
    window.print();
  }
}

export function exportSvgToFile(svgElement: SVGSVGElement, filename: string = 'TNS-Solar-SLD.svg'): void {
  const clone = svgElement.cloneNode(true) as SVGSVGElement;
  clone.setAttribute('width', '1360');
  clone.setAttribute('height', '920');
  clone.setAttribute('viewBox', '0 0 1360 920');

  const serializer = new XMLSerializer();
  let svgString = serializer.serializeToString(clone);
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

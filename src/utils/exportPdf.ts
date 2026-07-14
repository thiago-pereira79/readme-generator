export interface ExportResult {
  success: boolean;
  blockedByIframe?: boolean;
  corsErrors?: string[];
  error?: string;
}

/**
 * Wait for all images inside an element to load or fail, preventing canvas clipping
 */
async function waitForImages(element: HTMLElement): Promise<string[]> {
  const images = element.querySelectorAll('img');
  const corsErrors: string[] = [];
  
  const promises = Array.from(images).map((img) => {
    return new Promise<void>((resolve) => {
      if (img.complete) {
        resolve();
      } else {
        img.onload = () => resolve();
        img.onerror = () => {
          console.warn(`Could not load image in PDF or blocked by CORS: ${img.src}`);
          corsErrors.push(img.src);
          resolve(); // Resolve to avoid blocking the whole export
        };
      }
    });
  });
  
  await Promise.all(promises);
  return corsErrors;
}

/**
 * Capture an HTML element and download it as a high-fidelity PDF
 */
export async function exportToPdf(element: HTMLElement, filename: string): Promise<ExportResult> {
  try {
    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
      import('html2canvas'),
      import('jspdf'),
    ]);

    // 1. Wait for fonts to be ready
    if (document.fonts) {
      await document.fonts.ready;
    }

    // 2. Wait for images to load
    const corsErrors = await waitForImages(element);

    // 3. Render element to Canvas with html2canvas
    const canvas = await html2canvas(element, {
      scale: 2, // High resolution crispness
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      windowWidth: element.scrollWidth || 794,
      windowHeight: element.scrollHeight || 1000,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    
    // A4 Paper Dimensions: 210mm x 297mm
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    const margin = 10; // 10mm margins
    const contentWidth = pdfWidth - (margin * 2);
    
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    
    const ratio = contentWidth / imgWidth;
    const renderedImageHeight = imgHeight * ratio;
    
    let heightLeft = renderedImageHeight;
    let position = margin;
    
    // Add first page
    pdf.addImage(
      imgData, 
      'JPEG', 
      margin, 
      position, 
      contentWidth, 
      renderedImageHeight,
      undefined,
      'FAST'
    );
    heightLeft -= (pdfHeight - (margin * 2));
    
    // Add subsequent pages if content overflows A4 height
    while (heightLeft > 0) {
      position = heightLeft - renderedImageHeight + margin;
      pdf.addPage();
      pdf.addImage(
        imgData, 
        'JPEG', 
        margin, 
        position, 
        contentWidth, 
        renderedImageHeight,
        undefined,
        'FAST'
      );
      heightLeft -= (pdfHeight - (margin * 2));
    }
    
    // 4. Try to save the PDF. Detect sandbox/iframe blocks.
    const isIframe = window.self !== window.top;
    
    try {
      pdf.save(`${filename}.pdf`);
      return { success: true, corsErrors, blockedByIframe: isIframe };
    } catch (saveError) {
      console.error('Saving PDF blocked by sandbox or browser:', saveError);
      return { 
        success: false, 
        blockedByIframe: true, 
        corsErrors,
        error: saveError instanceof Error ? saveError.message : String(saveError) 
      };
    }
  } catch (error) {
    console.error('Failed to export PDF using canvas:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

/**
 * Fallback option: Print/Save as PDF using system print with formatted document styling
 */
export function printElement(element: HTMLElement) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    // Fall back to standard inline window print if popup is blocked
    window.print();
    return;
  }
  
  printWindow.document.write(`
    <html>
      <head>
        <title>Exportar README</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
            padding: 40px;
            color: #24292f;
            background-color: #ffffff;
            line-height: 1.6;
          }
          .markdown-body {
            max-width: 800px;
            margin: 0 auto;
          }
          h1, h2, h3, h4, h5, h6 {
            margin-top: 24px;
            margin-bottom: 16px;
            font-weight: 600;
            line-height: 1.25;
            color: #24292f;
            page-break-after: avoid;
          }
          h1 { border-bottom: 1px solid #d0d7de; padding-bottom: 0.3em; }
          h2 { border-bottom: 1px solid #d0d7de; padding-bottom: 0.3em; }
          p { margin-top: 0; margin-bottom: 16px; }
          ul, ol { margin-top: 0; margin-bottom: 16px; padding-left: 2em; }
          li { margin-top: 0.25em; }
          pre {
            background-color: #f6f8fa;
            padding: 16px;
            border-radius: 6px;
            overflow-x: auto;
            margin-bottom: 16px;
          }
          code {
            font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace;
            font-size: 85%;
            background-color: rgba(175,184,193,0.2);
            padding: 0.2em 0.4em;
            border-radius: 6px;
          }
          pre code {
            background-color: transparent;
            padding: 0;
            font-size: 100%;
          }
          blockquote {
            padding: 0 1em;
            color: #57606a;
            border-left: .25em solid #d0d7de;
            margin: 0 0 16px 0;
          }
          table {
            border-spacing: 0;
            border-collapse: collapse;
            width: 100%;
            margin-bottom: 16px;
          }
          table th, table td {
            padding: 6px 13px;
            border: 1px solid #d0d7de;
          }
          table tr:nth-child(even) {
            background-color: #f6f8fa;
          }
          img {
            max-width: 100%;
            height: auto;
          }
          hr {
            height: 0.25em;
            padding: 0;
            margin: 24px 0;
            background-color: #d0d7de;
            border: 0;
          }
        </style>
      </head>
      <body>
        <div class="markdown-body">
          ${element.innerHTML}
        </div>
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
              window.close();
            }, 500);
          };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
}

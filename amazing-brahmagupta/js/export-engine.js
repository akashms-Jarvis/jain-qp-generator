/* Export Engine - Exporting to PDF, DOCX, and Answer Keys */

class ExportEngine {
  /**
   * Export Question Paper set to browser Print / PDF
   */
  static exportToPDF(setName) {
    window.print();
  }

  /**
   * Export Question Paper to editable Word Document (.docx / .html format compatible with MS Word)
   */
  static exportToWord(setData) {
    const htmlContent = this.generateWordHTML(setData);
    const blob = new Blob(['\ufeff' + htmlContent], {
      type: 'application/msword'
    });
    
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = `Jain_University_${setData.code.replace(/[\/\s]/g, '_')}_${setData.setName.replace(/\s+/g, '')}.doc`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
  }

  /**
   * Export Answer Key & Marking Scheme
   */
  static exportAnswerKey(setData) {
    let keyText = `JAIN UNIVERSITY - CENTER FOR DISTANCE AND ONLINE EDUCATION\n`;
    keyText += `ANSWER KEY & MARKING SCHEME - ${setData.setName.toUpperCase()}\n`;
    keyText += `SUBJECT: ${setData.title} (${setData.code})\n`;
    keyText += `EXAM: ${setData.program} - ${setData.examDate}\n\n`;
    keyText += `=`.repeat(70) + `\n\n`;

    keyText += `SECTION A (Answer any EIGHT questions - 8 x 2 = 16 Marks)\n`;
    setData.sectionA.forEach(q => {
      keyText += `[${q.label}] ${q.text} (Unit: ${q.unit}, CO: ${q.co}, BTL: ${q.btl})\n`;
      keyText += `    -> ${q.answerKey}\n\n`;
    });

    keyText += `\nSECTION B (Answer any SIX questions - 6 x 4 = 24 Marks)\n`;
    setData.sectionB.forEach(q => {
      keyText += `[${q.label}] ${q.text} (Unit: ${q.unit}, CO: ${q.co}, BTL: ${q.btl})\n`;
      keyText += `    -> ${q.answerKey}\n\n`;
    });

    keyText += `\nSECTION C (Answer any THREE questions - 3 x 10 = 30 Marks)\n`;
    setData.sectionC.forEach(q => {
      keyText += `[${q.label}] ${q.text} (Unit: ${q.unit}, CO: ${q.co}, BTL: ${q.btl})\n`;
      keyText += `    -> ${q.answerKey}\n\n`;
    });

    const blob = new Blob([keyText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = `Answer_Key_${setData.setName.replace(/\s+/g, '')}_${setData.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
  }

  static generateWordHTML(setData) {
    const paperHTML = document.getElementById('paper-print-container').innerHTML;
    return `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>${setData.title} - ${setData.setName}</title>
        <style>
          body { font-family: 'Times New Roman', serif; font-size: 11pt; line-height: 1.35; }
          table { width: 100%; border-collapse: collapse; border: 1px solid #000; }
          th, td { border: 1px solid #000; padding: 4px 6px; }
          .ju-section-title { text-align: center; font-weight: bold; text-decoration: underline; }
          .ju-top-bar { display: flex; justify-content: space-between; }
        </style>
      </head>
      <body>
        ${paperHTML}
      </body>
      </html>
    `;
  }
}

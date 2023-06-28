import { formatDate } from '@angular/common';
import { Injectable } from '@angular/core';

declare let pdfMake: any;

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  private logo: string = '/assets/images/logo.png'

  constructor() { }

  private getBase64ImageFromURL(url: string) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute("crossOrigin", "anonymous");

      img.onload = () => {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        var ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0);

        var dataURL = canvas.toDataURL("image/png");

        resolve(dataURL);
      };

      img.onerror = error => {
        reject(error);
      };

      img.src = url;
    });
  }

  async downloadReportsPDF(graphsUrl: string[], loginLogs: any[]) {
    const logoDataUrl = await this.getBase64ImageFromURL(this.logo);
    const tableBody = loginLogs.map(log => [log.email, log.signInTime.toDate().toLocaleString()]);

    const documentDefinition = {
      pageMargins: [40, 60, 40, 40], // Adjust the top margin for subsequent pages
      header: {
        columns: [
          { image: logoDataUrl, width: 100 },
          { text: new Date().toLocaleDateString(), alignment: 'right' }
        ],
        margin: [40, 20],
        fontSize: 12
      },
      content: [
        { text: 'Gráficos', style: 'header' },
        {
          columns: [
            { image: graphsUrl[0], width: 250, height: 250 },
            { image: graphsUrl[1], width: 250, height: 125 }
          ]
        },
        {
          columns: [
            { image: graphsUrl[2], width: 250, height: 125 },
            { image: graphsUrl[3], width: 250, height: 250 }
          ]
        },
        { text: 'Registro de Ingresos', style: 'header' },
        {
          table: {
            headerRows: 1,
            widths: ['*', '*'],
            body: [
              ['Email usuario', 'Fecha y Hora'],
              ...tableBody
            ]
          }
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 40]
        }
      }
    };

    // const pdf = pdfMake.createPdf(documentDefinition);
    // pdf.download(`Reporte-${this.today.toLocaleDateString()}`);

    pdfMake.createPdf(documentDefinition).open();
  }

  async downloadClinicalStory(userName: string, clinicalStory: any[]) {
    const logoDataUrl = await this.getBase64ImageFromURL(this.logo);

    // let widthArray: string[] = [];
    // const tableBody = clinicalStory.map(story => {
    //   const row = [];
    //   for (const key in story) {
    //     if (story.hasOwnProperty(key)) {
    //       if (key === 'date') {
    //         row.push(story[key].toDate().toLocaleDateString());
    //       }
    //       else {
    //         row.push(story[key]);
    //       }
    //       widthArray.push('*');
    //     }
    //   }
    //   return row;
    // });

    const widthArray: string[] = [];
    const fieldNames: string[] = []; // Array to store all field names

    // Determine all unique field names from the clinicalStory objects
    clinicalStory.forEach(story => {
      for (const key in story) {
        if (story.hasOwnProperty(key) && !fieldNames.includes(key)) {
          fieldNames.push(key);
          widthArray.push('*');
        }
      }
    });

    // Create tableBody with consistent fields and assign "-" for missing fields
    const tableBody = clinicalStory.map(story => {
      const row = [];
      for (const fieldName of fieldNames) {
        if (fieldName === 'date') {
          row.push(story[fieldName]?.toDate().toLocaleDateString() || "-");
        } else {
          row.push(story[fieldName] || "-");
        }
      }
      return row;
    });

    const documentDefinition = {
      pageMargins: [40, 60, 40, 40], // Adjust the top margin for subsequent pages
      header: {
        columns: [
          { image: logoDataUrl, width: 100 },
          { text: new Date().toLocaleDateString(), alignment: 'right' }
        ],
        margin: [40, 20],
        fontSize: 12
      },
      content: [
        { text: `Historia clínica de ${userName}`, style: 'header' },
        ...clinicalStory.map((story, index) => ({
          stack: [
            { text: story.review || '', style: 'subheader' },
            { text: story.date ? `Fecha: ${story.date.toDate().toLocaleString()}` : '', style: 'subheader' },
            {
              ul: Object.keys(story)
                .filter(key => key !== 'review' && key !== 'date')
                .map(key => ({ text: `- ${key}: ${story[key]}` }))
            },
            index !== clinicalStory.length - 1 ? { text: '', margin: [0, 10] } : null
          ],
          style: 'story'
        }))
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 40]
        }
      }
    };

    // const pdf = pdfMake.createPdf(documentDefinition);
    // pdf.download(`Reporte-${this.today.toLocaleDateString()}`);

    pdfMake.createPdf(documentDefinition).open();
  }
}

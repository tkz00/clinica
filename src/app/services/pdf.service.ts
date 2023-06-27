import { formatDate } from '@angular/common';
import { Injectable } from '@angular/core';

declare let pdfMake: any;

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  private today = new Date();
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

    const pdf = pdfMake.createPdf(documentDefinition);
    pdf.download(`Reporte-${this.today.toLocaleDateString()}`);
  }
}

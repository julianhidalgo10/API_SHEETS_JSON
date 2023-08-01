const { google } = require('googleapis');
const fs = require('fs');

// Carga el archivo JSON de las credenciales
const credentials = require('./credenciales.json');

// ID de la hoja de cálculo de Google Sheets
const spreadsheetId = '1Y4zw0oFW_4thtp1e8cJAEbJYevHq1K2tbyYXrY4VBWs';

// Configuración de autenticación
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

// Función para convertir la hoja de cálculo a JSON
async function convertSheetToJson() {
  try {
    // Crea un cliente de Google Sheets
    const client = await auth.getClient();

    // Crea una instancia de la API de Google Sheets
    const sheets = google.sheets({ version: 'v4', auth: client });

    const response = await sheets.spreadsheets.get({
      spreadsheetId,
      includeGridData: true,
    });

    const sheetData = response.data.sheets[0].data[0];
    const values = sheetData.rowData;

    const data = values.map(row => {
      const rowValues = row.values.map(cell => cell.formattedValue);
      return rowValues;
    });

    const jsonContent = JSON.stringify(data, null, 2);
    fs.writeFileSync('datos.json', jsonContent);
    console.log('Hoja de cálculo convertida a JSON correctamente.');

  } catch (error) {
    console.error('Error al convertir la hoja de cálculo a JSON:', error);
  }
}

// Llama a la función para convertir la hoja de cálculo a JSON
convertSheetToJson();
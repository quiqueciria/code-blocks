const axios = require('axios');
const { Client } = require('@notionhq/client');

// Configuración de Strava
const STRAVA_ACCESS_TOKEN = 'tu_token_de_acceso_de_strava';
const stravaUrl = 'https://www.strava.com/api/v3/athlete/activities';

// Configuración de Notion
const NOTION_ACCESS_TOKEN = 'tu_token_de_acceso_de_notion';
const NOTION_DATABASE_ID = 'tu_id_de_base_de_datos_de_notion';
const notion = new Client({ auth: NOTION_ACCESS_TOKEN });

// Obtener actividades de Strava
axios.get(stravaUrl, {
  headers: { Authorization: `Bearer ${STRAVA_ACCESS_TOKEN}` }
})
.then(response => {
  const activities = response.data;
  activities.forEach(activity => {
    // Formatear los datos para Notion
    notion.pages.create({
      parent: { database_id: NOTION_DATABASE_ID },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: activity.name
              }
            }
          ]
        },
        Distance: {
          number: activity.distance
        },
        Date: {
          date: {
            start: activity.start_date_local
          }
        }
        // Agrega más propiedades según tus necesidades
      }
    });
  });
})
.catch(error => {
  console.error(`Error al obtener actividades de Strava: ${error}`);
});

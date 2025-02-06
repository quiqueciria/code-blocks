const axios = require("axios");
const { Client } = require("@notionhq/client");

// Configuración de Strava
const STRAVA_ACCESS_TOKEN = 'tu_token_de_acceso_de_strava';
const stravaUrl = 'https://www.strava.com/api/v3/athlete/activities';

// Configuración de Notion
const NOTION_ACCESS_TOKEN = 'tu_token_de_acceso_de_notion';
const NOTION_DATABASE_ID = 'tu_id_de_base_de_datos_de_notion';
const notion = new Client({ auth: NOTION_ACCESS_TOKEN });

// Obtener actividades de Strava
axios
  .get(stravaUrl, {
    headers: { Authorization: `Bearer ${STRAVA_ACCESS_TOKEN}` },
  })
  .then((response) => {
    const activities = response.data;
    activities.forEach(async (activity) => {
      // Convierte metros a kilómetros
      const distanceInKilometers = parseFloat(
        (activity.distance / 1000).toFixed(2)
      );
      // Convertir a Horas
      const elapsedTimeInHours = parseFloat(
        (activity.elapsed_time / 3600).toFixed(2)
      );
      //Comprueba si hay ya una actividad
      const existingPage = await notion.databases.query({
        database_id: NOTION_DATABASE_ID,
        filter: {
          property: "Strava ID",
          rich_text: {
            equals: activity.id.toString(),
          },
        },
      });
      if (existingPage.results.length === 0) {
        try {
          await notion.pages.create({
            parent: { database_id: NOTION_DATABASE_ID },
            properties: {
              Name: {
                title: [
                  {
                    text: {
                      content: activity.name,
                    },
                  },
                ],
              },
              Distance: {
                number: distanceInKilometers,
              },
              Date: {
                date: {
                  start: activity.start_date,
                },
              },
              "Strava ID": {
                rich_text: [
                  {
                    text: {
                      content: activity.id.toString(),
                    },
                  },
                ],
              },
            },
          });
        } catch (error) {
          console.error(
            "Error al crear página en Notion:",
            error.response ? error.response.data : error
          );
        }
      }
    });
  })
  .catch((error) => {
    console.error(`Error al obtener actividades de Strava: ${error}`);
  });

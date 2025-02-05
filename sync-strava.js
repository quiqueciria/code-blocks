const axios = require("axios");
const { Client } = require("@notionhq/client");

// Configuración de Strava
const STRAVA_ACCESS_TOKEN = "e8235944b6476de51ac55ce60d615ceb6a76ca53";
const stravaUrl = "https://www.strava.com/api/v3/athlete/activities";

// Configuración de Notion
const NOTION_ACCESS_TOKEN =
  "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";
const NOTION_DATABASE_ID = "18fad089a85b806ead00f35c5456f74a";
const notion = new Client({ auth: NOTION_ACCESS_TOKEN });

// Obtener actividades de Strava
axios
  .get(stravaUrl, {
    headers: { Authorization: `Bearer ${STRAVA_ACCESS_TOKEN}` },
  })
  .then((response) => {
    const activities = response.data;
    activities.forEach(async (activity) => {
      // Formatear los datos para Notion
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
              Elapsed: {
                number: elapsedTimeInHours,
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

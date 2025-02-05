const existingPage = await notion.databases.query({
  database_id: NOTION_DATABASE_ID,
  filter: {
    property: "Strava ID",
    rich_text: {
      equals: activity.id.toString(),
    },
  },
});

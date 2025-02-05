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

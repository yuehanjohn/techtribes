export default async function scrape(events: string | URL | Request) {
  const response = await fetch(events);
  const data = await response.json();
  return {
    future: data.future
      ? {
          date: data.future.date,
          link: data.future.link,
        }
      : undefined,
    past: data.past
      ? {
          date: data.past.date,
          link: data.past.link,
        }
      : undefined,
    members: data.members,
  };
}

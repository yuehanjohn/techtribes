# Meetups

## Overview

This is the source code for a site listing tech communitis and their events in Finland. The site is built with Jekyll and hosted on GitHub Pages. The list of events is automatically updated on a daily schedule.

## Add a community

To add or update a community listing, create a pull request with changes to [this file](_data/input.yml). The communities are listed in alphabetical order by name, so make sure to add it in the correct place or run `npm run sort` before committing.

A sample entry looks like this:

```yaml
- name: HelsinkiJS
  location: Helsinki, Finland
  tags:
    - JavaScript
    - TypeScript
    - Node.js
  url: https://www.meetabit.com/communities/helsinkijs
  logo: https://helsinkijs.org/assets/icon.180.png
```

- `location` should be the city name and country (Finland), separated by a comma
- `tags` should reuse existing ones if possible and keep their spelling consistent
- `url` should be the URL of the community's homepage on [Meetabit](https://www.meetabit.com/) or [Meetup.com](https://www.meetup.com/) (if you'd like to add another site, you will need send a PR for that scraper first)
- `logo` should be the URL of the community's logo, ideally 128x128 pixels in PNG format hosted on a short URL such that if your logo changes, the URL won't

## Development

Install dendencies:

```bash
bundle install
npm install
```

Generate data:

```
npm start
```

Run development server:

```bash
jekyll serve --livereload --host 0.0.0.0
```

The pages will now automatically reload whenever you edit any file. Also, you can view the pages from mobile devices connected to the same network.

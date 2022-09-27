# Payload vs. Directus vs. Strapi Speed Test

With this performance test, we wanted to see how a real-world, complex document query might fare while retrieved from the three different CMS' GraphQL endpoints. Let's consider a complex "mega menu" document, where there may be 30-50 "links" to other pages / posts / etc. and lots of media relations like icons, images, etc. that need to be rendered in a given mega menu. Just with that one mega menu document, we might have to retrieve a ton of "related" documents, with lots of JSON coming back from the response. 

In our past experience, this can quickly become problematic (especially if you are server-side rendering) because that mega menu "document" is used by and needs to be retrieved for **every single server-rendered view** of a given app or website. That means that unless your CMS is heavily optimized, you're going to need to shell out some cash to make sure your server can handle this type of request. To make matters worse, modern frontend frameworks like Gatsby or Next often pre-render views, which means that during the build process, your server could get hammered with requests to your API.

To reflect a moderately complex real-world query, we designed a document structure that features 60+ relationships as well as complex data structures like groups, arrays, nested arrays, and blocks. The document itself is seeded predictably and exactly in the same manner through all three content management systems, and the GraphQL queries that are run are exactly the same outside of specific CMS syntax differences.

## Results

Results are analyzed across 100 sequential queries. Unit is milliseconds.

| Platform | Average | Max | Min | Total Test Time |
| -------- | ------- | --- | --- | --------------- |
| Payload  | 15      | 43  | 8   | 1513            |
| Directus | 45      | 139 | 24  | 4459            |
| Strapi   | 102     | 353 | 77  | 10172           |

## Setup and Run Tests

Each platform has individual setup and execution steps documented below. Results are output as `<platform>-results.json` in the root project directory.

To run performance tests for a specific CMS, run `yarn` in the root folder, and then follow the steps below for whichever CMS you're looking to test.

### Payload

1. `cd ./payload`
1. Copy .env.example to .env and update values if necessary
1. `yarn install`
1. On top-level, run `yarn payload:run`
1. In another terminal window, run `yarn payload:test`

### Directus

1. Create DB named `directus` in Postgres
1. Restore `dump.sql` against `directus` DB
1. `cd ./directus`
1. `yarn install`
1. Copy .env.example to .env and update values if necessary
1. On top-level, run `yarn directus:run`
1. In another terminal window, run `yarn seed`
1. Run `yarn directus:test`

### Strapi

1. Create DB named `strapi` in Postgres
1. `cd ./strapi`
1. Copy .env.example to .env and update values if necessary
1. `yarn install`
1. On top-level, run `yarn strapi:run`
1. In another terminal window, run `yarn strapi:bootstrap`
1. `yarn strapi:test`

# Generate routes for New World using Mapbox

Express server and react client

Displays harvestable nodes in New World on a map using Mapbox.

Select nodes on the map using mapbox-gl-draw and a route will be calculated for you.

see it in action:  https://nw-routes.herokuapp.com/

marker sprites by [MapGenie](https://mapgenie.io/new-world/maps/aeternum).

node data from [New World Maps](https://www.newworld-map.com)

# Commands

`npm run server` - Start the backend server in dev mode.  Used to generate node geojson and modify any backing node data.

`npm run client` - Start the react client in dev mode.

`npm run build` - Generate production builds for client and backend.

`npm run start` - Start the production backend server.  This should only be used in production.

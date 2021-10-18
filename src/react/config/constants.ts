export const BACKEND_ROOT =
  process.env.REACT_APP_BACKEND_ROOT ?? "http://localhost:3001/"

export const API_ROOT = `${BACKEND_ROOT}graphql/`

export const mapStyle: any = {
  version: 8,
  name: "Blank",
  metadata: {
    "mapbox:autocomposite": true,
    "mapbox:type": "template",
    "mapbox:sdk-support": {
      android: "10.0.0",
      ios: "10.0.0",
      js: "2.3.0",
    },
    "mapbox:uiParadigm": "components",
    "mapbox:groups": {},
  },
  center: [0.10219737344013424, 0.033692100061983865],
  zoom: 11.834850658043104,
  bearing: 0,
  pitch: 0,
  sources: {
    "mapbox://bsin1.2bmvbsar": {
      url: "mapbox://bsin1.2bmvbsar",
      type: "raster",
      tileSize: 256,
    },
  },
  sprite: `${BACKEND_ROOT}markers`,
  glyphs: "mapbox://fonts/mapbox/{fontstack}/{range}.pbf",
  layers: [
    {
      id: "bsin1-2bmvbsar",
      type: "raster",
      source: "mapbox://bsin1.2bmvbsar",
      layout: {},
      paint: {},
    },
  ],
}

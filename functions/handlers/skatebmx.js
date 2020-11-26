//  OPEN DATA SOURCE FOR SKATE AND BMX FACILITIES IN MALAGA. originally a geojson file, it is updated monthly
const URL_SKATES = "https://datosabiertos.malaga.eu/recursos/deportes/equipamientos//da_deportesPatinajeSkateBmx-25830.geojson";

//  Used for HTTP Calls
const Axios = require("axios");

//  Used for JSON transformation
const DataTransform = require("node-json-transform").DataTransform;

//Structure to simplify the given data
const skateMap = {
    list: "skates",
  item: {
    id: "id",
    nombre: "properties.NOMBRE",
    location: { // USING EPSG 25830 (COORDINATES IN METERS)
      lon: "geometry.coordinates.0",
      lat: "geometry.coordinates.1"
      
    }
  }
  }

exports.skatebmx = (request, response) => {

    Axios.get(URL_SKATES)
        .then(res => {
          let dbInMemory = { skates: res.data.features }; //Takes only the JSON elements (The source is a GeoJSON file)
          let dataTransform = DataTransform(dbInMemory, skateMap);
          let result = dataTransform.transform();
  
          //Find the parks that satisfy the condition of distance
          function findItems(array) {
            var aux = [];
            for (var i = 0; i < array.length; i++) {
              var x = array[i].location.lon;
              var y = array[i].location.lat;
              let distancia = Math.sqrt(Math.pow((request.body.lon - x), 2) + Math.pow((request.body.lat - y), 2));
               if (distancia <= request.body.meters) {
                   aux.push(array[i]);
               }
            }
            return(aux);
        }
        
       
        return response.json(findItems(result));
  
        })
        .catch(err => {
          response.status(500).json({error: 'Something went wrong'});
          console.error(err);
        })
          
  }
//  OPEN DATA SOURCE FOR PAPER CONTAINERS IN MALAGA. originally a geojson file, it is updated daily
const URL_PAPER = "https://datosabiertos.malaga.eu/recursos/ambiente/limasa/da_papelCarton-25830.geojson"

//  Used for HTTP Calls
const Axios = require("axios");

//  Used for JSON transformation
const DataTransform = require("node-json-transform").DataTransform;

//Structure to simplify the given data
const containerMap = {
  list: "containers",
item: {
  id: "id",
  recogida: "properties.recogida",
  location: { // USING EPSG 25830 (COORDINATES IN METERS)
    lon: "geometry.coordinates.0",
    lat: "geometry.coordinates.1"
    
  }
}
}

exports.container = (request, response) => {

  Axios.get(URL_PAPER)
      .then(res => {
        let dbInMemory = { containers: res.data.features }; //Takes only the JSON elements (The source is a GeoJSON file)
        let dataTransform = DataTransform(dbInMemory, containerMap);
        let result = dataTransform.transform();
        
        //Find the container with the closest position to the given coordinates
        function findItem(array) {
          var temp;
          var aux = [];
          for (var i = 0; i < array.length; i++) {
            
            var x = array[i].location.lon;
            var y = array[i].location.lat;
            let distancia = Math.sqrt(Math.pow((request.body.lon - x), 2) + Math.pow((request.body.lat - y), 2));

            if(i === 0){
              temp = distancia;
              aux.push(array[i]);
            }else{
              if (temp < distancia) {
                temp = distancia;
                aux = [];
                aux.push(array[i]);
              }
             
            }
          }
          return(aux);
      }
      
     
      return response.json(findItem(result));

      })
      .catch(err => {
        response.status(500).json({error: 'Something went wrong'});
        console.error(err);
      })
        
}
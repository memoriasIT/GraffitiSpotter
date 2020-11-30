import react, {useEffect, useState} from 'react';
import axios from "axios";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  Popup,
} from "react-leaflet";
import proj4 from "proj4";

proj4.defs("EPSG:25830","+proj=utm +zone=30 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");

const Mapa = () => {

  const [current, setCurrent] = useState(); 
  const [puntos, setPuntos] = useState([]);
  const [info, setInfo] = useState([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function(pos){
      setCurrent({lat: pos.coords.latitude, lng: pos.coords.longitude});
      var posiA25830 = proj4('EPSG:4326', 'EPSG:25830', [pos.coords.longitude, pos.coords.latitude])//Pasa la localización del usuario de EPGS4326 A 25830 (CON LO QUE TRABAJA EL JSON)
      axios.get('http://localhost:5000/thegraffitispotter/us-central1/api/container', {
        params:{
          "lat": posiA25830[0],//  4061985.986 this.state.userLat, 
          "lon": posiA25830[1], // pos.coords.longitude  369689.949, this.state.userLon, 
        },
      })
      .then((res) => {
        setPuntos([proj4('EPSG:25830', 'EPSG:4326', [res.data[0].location.lon, res.data[0].location.lat]).reverse()])
        setInfo([res.data[0].id, res.data[0].recogida])
        // guardas en Mpos los datos que recibes del servidor
        //setPuntos([[36.056464,36.056464]]);
        console.log("LOS DATOS");
        console.log(res.data[0].location.lon);
        
        console.log(pos.coords.latitude);
        console.log(pos.coords.longitude);
      }).catch((err) => {
        console.log(err);

      });
    });
  },[]);

  function ChangeView({ zoom }) {
    const map = useMap();
    map.setView(current, zoom);// A pretty CSS3 popup. <br /> Easily customizable.
    return null;
  }

  return (
    <div className="App">
        <MapContainer center={{lat: 36.056464, lng: -4.63546}} zoom={15}>
          {current && 
          <ChangeView zoom={15} /> 
          }
          {puntos.map((p) => (
            <Marker position={p}>
              <Popup>
                {"Contenedor de papel/cartón más cercano \n ID: "+ info[0] +" \n Tipo de recogida: " + info[1]}
              </Popup>
            </Marker>
          ))}
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        ></TileLayer>
        
      </MapContainer>
    </div>
  );
}

export default Mapa;

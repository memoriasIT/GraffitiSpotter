const functions = require('firebase-functions');

// Used to get access to the database
const admin = require('firebase-admin');
admin.initializeApp();

// Express to manage calls
const express = require('express');
const app = express();

//  OPEN DATA SOURCE FOR SKATE AND BMX FACILITIES IN MALAGA. originally a geojson file, it is updated monthly
const URL_SKATES = "https://datosabiertos.malaga.eu/recursos/deportes/equipamientos//da_deportesPatinajeSkateBmx-25830.geojson";

//  OPEN DATA SOURCE FOR PAPER CONTAINERS IN MALAGA. originally a geojson file, it is updated daily
const URL_PAPER = "https://datosabiertos.malaga.eu/recursos/ambiente/limasa/da_papelCarton-25830.geojson"

//  OPEN DATA SOURCE FOR ECOPUNTOS IN MALAGA, originally a geojson file, it is updated daily
const URL_ECOPUNTO = "https://datosabiertos.malaga.eu/recursos/energia/ecopuntos/da_ecopuntos-25830.geojson"

//  Used for HTTP Calls
const Axios = require("axios");
const { toNamespacedPath } = require('path');

//  Used for JSON transformation
const DataTransform = require("node-json-transform").DataTransform;


//  ██╗   ██╗███████╗███████╗██████╗ ███████╗
//  ██║   ██║██╔════╝██╔════╝██╔══██╗██╔════╝
//  ██║   ██║███████╗█████╗  ██████╔╝███████╗
//  ██║   ██║╚════██║██╔══╝  ██╔══██╗╚════██║
//  ╚██████╔╝███████║███████╗██║  ██║███████║
//   ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝╚══════╝
//  CRUD for the 'usuarios' collection              

 // CREATE a new user with a POST request. Takes input from body in JSON format.
 app.post('/createUser', (req, res) => {
  // Take data from request body
  const newUser = {
    biografia: req.body.biografia,
    edad: req.body.edad,
    imagen: req.body.imagen,
    nombre: req.body.nombre,
    password: req.body.password,
    username: req.body.username,
  }

  // Add a document to the collection with id of the username, use object newUser
  admin.firestore().collection('usuarios').doc(req.body.username).set(newUser)
  .then (doc => {
     res.json({message: 'User created successfully'});
     return res;
  })
  .catch(err => {
    res.status(500).json({error: 'Something went wrong'});
    console.error(err);
  })
})



// READ all users
app.get('/users', (req, res) => {
  admin
  .firestore()
  .collection('usuarios')
  .orderBy('username')
  .get()
  .then((data) => {
    let users = [];
    data.forEach((doc) => {
      // Push an object to response with all user parameters
      users.push({
        userId: doc.id,
        body: doc.data().body,
        biografia: doc.data().biografia,
        edad: doc.data().edad,
        imagen: doc.data().imagen,
        nombre: doc.data().nombre,
        password: doc.data().password,
        username: doc.data().username,
      });
    });
    
    // Give response in JSON format
    return res.json(users);
  })
  .catch(err => console.error(err));
});

// UPDATE an existing user given a userId
app.put('/updateUser', (req, res) => {
  // Take data from request body
  const updateUser = {
    biografia: req.body.biografia,
    edad: req.body.edad,
    imagen: req.body.imagen,
    nombre: req.body.nombre,
    password: req.body.password,
    username: req.body.username,
  }

  // Add a document to the collection with id of the username, use object newUser
  admin.firestore().collection('usuarios').doc(req.body.username).update(updateUser)
  .then (doc => {
     res.json({message: 'User updated successfully'});
     return res;
  })
  .catch(err => {
    res.status(500).json({error: 'Something went wrong'});
    console.error(err);
  })
})

// DELETE an existing user given a userId
app.delete('/deleteUser', (req, res) => {
  // Deletes a document with the id provided in body request
  admin.firestore().collection('usuarios').doc(req.body.username).delete()
  .then (doc => {
     res.json({message: 'User deleted successfully'});
     return res;
  })
  .catch(err => {
    res.status(500).json({error: 'Something went wrong'});
    console.error(err);
  })
})

// COMMENTS

// CREATE a new user with a POST request. Takes input from body in JSON format.
app.post('/createComment', (req, res) => {
 // Take data from request body
 const newComment = {
   usuario: req.body.usuario,
   graffiti: req.body.graffiti,
   comentario: req.body.comentario,
 }

 // Add a document to the collection with id of the username, use object newUser
 admin.firestore().collection('comentarios').doc().set(newComment)
 .then (doc => {
    res.json({message: 'Comment created successfully'});
    return res;
 })
 .catch(err => {
   res.status(500).json({error: 'Something went wrong'});
   console.error(err);
 })
})

// READ all comments
app.get('/comments', (req, res) => {
  admin
  .firestore()
  .collection('comentarios')
  .orderBy('graffiti')
  .get()
  .then((data) => {
    let comments = [];
    data.forEach((doc) => {
      // Push an object to response with all user parameters
      comments.push({
        commentId: doc.id,
        body: doc.data().body,
        usuario: doc.data().usuario.id,
        graffiti: doc.data().graffiti.id,
        comentario: doc.data().comentario,
      });
    });
    
    // Give response in JSON format
    return res.json(comments);
  })
  .catch(err => console.error(err));
});

// UPDATE an existing user given a userId
app.put('/updateComment', (req, res) => {
  // Take data from request body
  const updateComment = {
    usuario: req.body.usuario,
    graffiti: req.body.graffiti,
    comentario: req.body.comentario,
  }
  admin.firestore().collection('comentarios').doc(req.body.id).update(updateComment)
  .then (doc => {
     res.json({message: 'Comment updated successfully'});
     return res;
  })
  .catch(err => {
    res.status(500).json({error: 'Something went wrong'});
    console.error(err);
  })
})

// DELETE an existing comment given a commentId
app.delete('/deleteComment', (req, res) => {
  // Deletes a document with the id provided in body request
  admin.firestore().collection('comentarios').doc(req.body.id).delete()
  .then (doc => {
     res.json({message: 'Comment deleted successfully'});
     return res;
  })
  .catch(err => {
    res.status(500).json({error: 'Something went wrong'});
    console.error(err);
  })
})

/* 
 * Graffitis 
 */


 // CREATE a new grafitti with a POST request. Takes input from body in JSON format.
 app.post('/createGraffiti', (req, res) => {
  // Take data from request body
  const newGraffiti = {
    autor: req.body.autor,
    commentCount: req.body.commentCount,
    descripcion: req.body.descripcion,
    estado: req.body.estado,
    fecha: req.body.fecha,
    imagen: req.body.imagen,
    likeCount: req.body.likeCount,
    localizacion: req.body.localizacion,
    tematica: req.body.tematica,
    titulo: req.body.titulo,
  }

  // Add a document to the collection, use object newGraffiti
  admin.firestore().collection('graffitis').add(newGraffiti)
  .then (doc => {
     res.json({message: 'Graffiti created successfully'});
     return res;
  })
  .catch(err => {
    res.status(500).json({error: 'Something went wrong'});
    console.error(err);
  })
})



// READ all graffitis
app.get('/graffitis', (req, res) => {
  admin
  .firestore()
  .collection('graffitis')
  .orderBy('fecha')
  .get()
  .then((data) => {
    let graffitis = [];
    data.forEach((doc) => {
      // Push an object to response with all graffiti parameters
      graffitis.push({
        id: doc.id,
        body: doc.data().body,
        autor: doc.data().autor.id,
        commentCount: doc.data().commentCount,
        descripcion: doc.data().descripcion,
        estado: doc.data().estado,
        fecha: doc.data().fecha,
        imagen: doc.data().imagen,
        likeCount: doc.data().likeCount,
        localizacion: doc.data().localizacion,
        tematica: doc.data().tematica,
        titulo: doc.data().titulo,
      });
    });
    
    // Give response in JSON format
    return res.json(graffitis);
  })
  .catch(err => console.error(err));
});

// UPDATE an existing graffiti given a id
app.put('/updateGraffiti', (req, res) => {
  // Take data from request body
  const updateGraffiti = {
    autor: req.body.autor,
    commentCount: req.body.commentCount,
    descripcion: req.body.descripcion,
    estado: req.body.estado,
    fecha: req.body.fecha,
    imagen: req.body.imagen,
    likeCount: req.body.likeCount,
    localizacion: req.body.localizacion,
    tematica: req.body.tematica,
    titulo: req.body.titulo,
  }

  // Add a document to the collection with id of the graffiti, use object updateGraffiti
  admin.firestore().collection('graffitis').doc(req.body.id).update(updateGraffiti)
  .then (doc => {
     res.json({message: 'Graffiti updated successfully'});
     return res;
  })
  .catch(err => {
    res.status(500).json({error: 'Something went wrong'});
    console.error(err);
  })
})

// DELETE an existing graffiti given a id
app.delete('/deleteGraffiti', (req, res) => {
  // Deletes a document with the id provided in body request
  admin.firestore().collection('graffitis').doc(req.body.id).delete()
  .then (doc => {
     res.json({message: 'Graffiti deleted successfully'});
     return res;
  })
  .catch(err => {
    res.status(500).json({error: 'Something went wrong'});
    console.error(err);
  })
})

//Like a graffiti
app.get('/graffiti/:graffitiId/likeGraffiti', (request, response) => {
  const db = admin.firestore();
  const likeDoc = db.collection('likes').where('usuario', '==', request.user.username)
      .where('graffiti', '==', request.params.graffitiId).limit(1);

  const graffitiDoc = db.doc(`/graffitis/${request.params.graffitiId}`);

  let graffitiData;

  graffitiDoc.get()
    .then(doc => {
        if(doc.exists) {
            graffitiData = doc.data();
            graffitiData.graffitiId = doc.id;
            return likeDoc.get();
        } else {
            return response.status(404).json({error : 'Graffiti no encontrado'});
        }
    })
    .then(data => {
        if(data.empty) {
            return db.collection('likes').add({
                graffiti : request.params.graffitiId,
                usuario: request.user.username
            })
            .then(() => {
                graffitiData.likeCount++
                return graffitiDoc.update({likeCount: graffitiData.likeCount})
            })
            .then(() => {
                return response.json(graffitiData);
            })
        } else {
            return response.status(400).json({error: 'Graffiti already liked'});
        }
    })
    .catch(err => {
        console.error(err)
        return response.status(500).json({error: err.code});
    })
});
//Unlike a graffiti
app.get('/graffiti/:graffitiId/unlikeGraffiti', (request, response) => {
  const db = admin.firestore();
  const likeDoc = db.collection('likes').where('usuario', '==', request.user.username)
  .where('graffiti', '==', request.params.graffitiId).limit(1);

 const graffitiDoc = db.doc(`/graffitis/${request.params.graffitiId}`);

 let graffitiData;

 graffitiDoc.get()
    .then(doc => {
        if(doc.exists) {
            graffitiData = doc.data();
            graffitiData.graffitiId = doc.id;
            return likeDoc.get();
        } else {
            return response.status(404).json({error : 'Graffiti no encontrado'});
        }
    })
    .then(data => {
        if(!data.empty) {
            return db.doc(`/likes/${data.docs[0].id}`).delete()
             .then(() =>{
                 graffitiData.likeCount--;
                 return graffitiDoc.update({likeCount: graffitiData.likeCount});
             })
             .then(() => {
                 response.json(graffitiData);
             })
        } else {
            return response.status(400).json({error: 'Graffiti not liked'});
        }
    })
    .catch(err => {
        console.error(err)
        response.status(500).json({error: err.code});
    })
});
// ██████╗ ██████╗ ███████╗███╗   ██╗    ██████╗  █████╗ ████████╗ █████╗ 
//██╔═══██╗██╔══██╗██╔════╝████╗  ██║    ██╔══██╗██╔══██╗╚══██╔══╝██╔══██╗
//██║   ██║██████╔╝█████╗  ██╔██╗ ██║    ██║  ██║███████║   ██║   ███████║
//██║   ██║██╔═══╝ ██╔══╝  ██║╚██╗██║    ██║  ██║██╔══██║   ██║   ██╔══██║
//╚██████╔╝██║     ███████╗██║ ╚████║    ██████╔╝██║  ██║   ██║   ██║  ██║
// ╚═════╝ ╚═╝     ╚══════╝╚═╝  ╚═══╝    ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝
// Functions using open data from Ayuntamiento de Malaga                                                                        
                                                                        

//---------------------------------------------------------------------------------------
//
//
//  Returns all the skatebmx areas in a radius of x meters from a given position
//
//
//---------------------------------------------------------------------------------------


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

app.get('/skatebmx', (request, response) => {

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
        
})


//--------------------------------------------------------------------------------------
//
//
//  Returns the nearest paper container and his type from a position given the in request
//
//
//--------------------------------------------------------------------------------------


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

app.get('/container', (request, response) => {

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
        
}) 

//---------------------------------------------------------------------
//
//
//  Returns data (In particular a high res picture) of the nearest Ecopunto
//    
//
//--------------------------------------------------------------------


//Structure to simplify the given data
const ecopuntoMap = {
  list: "ecopuntos",
item: {
  id: "id",
  foto: "properties.foto",
  elemento: "properties.elemento",
  location: { // USING EPSG 25830 (COORDINATES IN METERS)
    lon: "geometry.coordinates.0",
    lat: "geometry.coordinates.1"
    
  }
}
}

app.get('/ecopunto', (request, response) => {

  Axios.get(URL_ECOPUNTO)
      .then(res => {
        let dbInMemory = { ecopuntos: res.data.features }; //Takes only the JSON elements (The source is a GeoJSON file)
        let dataTransform = DataTransform(dbInMemory, ecopuntoMap);
        let result = dataTransform.transform();
        
        //Find the ecopunto with the closest location to the given coordinates
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
        
}) 

// https://url.com/api/....
exports.api = functions.https.onRequest(app);

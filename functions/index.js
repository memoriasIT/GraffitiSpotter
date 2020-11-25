const functions = require('firebase-functions');

// Used to get access to the database
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

// Auth
const firebase = require('firebase');
var firebaseConfig = {
  apiKey: "AIzaSyACyZk22WGD44rDR4QEuwtTcoNH_UOjFCE",
  authDomain: "thegraffitispotter.firebaseapp.com",
  databaseURL: "https://thegraffitispotter.firebaseio.com",
  projectId: "thegraffitispotter",
  storageBucket: "thegraffitispotter.appspot.com",
  messagingSenderId: "433358686297",
  appId: "1:433358686297:web:8c41adf7aa3d2a2a768948"
};

firebase.initializeApp(firebaseConfig);


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


//  ███╗   ███╗██╗██████╗ ██████╗ ██╗     ███████╗██╗    ██╗ █████╗ ██████╗ ███████╗
//  ████╗ ████║██║██╔══██╗██╔══██╗██║     ██╔════╝██║    ██║██╔══██╗██╔══██╗██╔════╝
//  ██╔████╔██║██║██║  ██║██║  ██║██║     █████╗  ██║ █╗ ██║███████║██████╔╝█████╗  
//  ██║╚██╔╝██║██║██║  ██║██║  ██║██║     ██╔══╝  ██║███╗██║██╔══██║██╔══██╗██╔══╝  
//  ██║ ╚═╝ ██║██║██████╔╝██████╔╝███████╗███████╗╚███╔███╔╝██║  ██║██║  ██║███████╗
//  ╚═╝     ╚═╝╚═╝╚═════╝ ╚═════╝ ╚══════╝╚══════╝ ╚══╝╚══╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝

const AuthenticationMiddleware = (req, res, next) => {
  let idToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    idToken = req.headers.authorization.split('Bearer ')[1];
  } else {
    console.error('No token found');
    return res.status(403).json({ error: 'Unauthorized' });
  }
  
  // A token was received, verify the token was issued by us
  admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      req.user = decodedToken;
      // console.log(decodedToken);
      return db
        .collection('usuarios')
        .where('userId', '==', req.user.uid)
        .limit(1)
        .get();
    })
    .then((data) => {
      req.user.username = data.docs[0].data().username;
      return next();
    })
    // TODO also catch TypeError when no user found: Error while verifying token  TypeError: Cannot read property 'data' of undefined
    .catch((err) => { // not valid, blacklisted, etc.
      console.error('Error while verifying token ', err);
      return res.status(403).json(err);
    });
};


//  ██╗   ██╗███████╗███████╗██████╗ ███████╗
//  ██║   ██║██╔════╝██╔════╝██╔══██╗██╔════╝
//  ██║   ██║███████╗█████╗  ██████╔╝███████╗
//  ██║   ██║╚════██║██╔══╝  ██╔══██╗╚════██║
//  ╚██████╔╝███████║███████╗██║  ██║███████║
//   ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝╚══════╝
//  CRUD for the 'usuarios' collection              

// Signup route
app.post('/signup', (req, res) => {
  // HELPER FUNCTIONS TO VALIDATE INPUTS
  // -----------------
  // Email must follow email pattern - Just believe the regex lol
  const isEmail = (email) => {
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.match(regEx)) return true; // It is a valid email
    else return false;
  };
  
  // Email cannot be empty
  const isEmpty = (string) => {
    // If only spaces it is deleted aswell
    if (string.trim() === '') return true;
    else return false;
  };
  // -----------------

  // Create object from request inputs
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    username: req.body.username
  };

  // Push errors if any
  let errors = {};

  // Check mail
  if (isEmpty(newUser.email)) {
    errors.email = 'Must not be empty';
  } else if (!isEmail(newUser.email)) {
    errors.email = 'Must be a valid email address';
  }

  // Check password
  if (isEmpty(newUser.password)) errors.password = 'Must not be empty';
  if (newUser.password !== newUser.confirmPassword)
    errors.confirmPassword = 'Passwords must match';

  // Check username
  if (isEmpty(newUser.username)) errors.username = 'Must not be empty';

  // Throw bad code if any error ocurred
  if (Object.keys(errors).length > 0) return res.status(400).json(errors);
  

  let token, userId;
  db.doc(`/users/${newUser.username}`)
    .get()
    .then((doc) => {
      // UserID must be unique
      if (doc.exists) {
        // Bad request - User exists
        return res.status(400).json({ username: 'This username is already taken' });
      } else {
        // Register user
        return firebase
          .auth().createUserWithEmailAndPassword(newUser.email, newUser.password);
      }
    })
    // User was created, return access token
    .then((data) => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then((idToken) => {
      token = idToken;
      // We need more info than what firebase auth needs
      // We store it in firestore /usuarios/
      const newUserInFirestore = {
        biografia: req.body.biografia,
        edad: req.body.edad,
        imagen: req.body.imagen,
        nombre: req.body.nombre,
        password: newUser.password,
        username: newUser.username,
        userId: userId,
      }

      return db.doc(`/usuarios/${newUser.username}`).set(newUserInFirestore);
    })
    // Successfully created code and token to the user
    .then(() => {
      return res.status(201).json({ token });
    })
    // Log error and send bad status code
    .catch((err) => {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        return res.status(400).json({ email: 'Email is already is use' });
      } else {
        return res.status(500).json({ error: err.code });
      }
    });
});


// Login route
app.post('/login', (req, res) => {
  // HELPER FUNCTION TO VALIDATE
  // Email cannot be empty
  const isEmpty = (string) => {
    // If only spaces it is deleted aswell
    if (string.trim() === '') return true;
    else return false;
  };

  const user = {
    email: req.body.email,
    password: req.body.password
  };

  // Store errors for response
  let errors = {};

  // Validate input email and password
  if (isEmpty(user.email)) errors.email = 'Must not be empty';
  if (isEmpty(user.password)) errors.password = 'Must not be empty';

  // Return errors and error code
  if (Object.keys(errors).length > 0) return res.status(400).json(errors);

  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then((data) => {
      return data.user.getIdToken();
    })
    .then((token) => {
      return res.json({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.code === 'auth/wrong-password') {
        return res
          .status(403)
          .json({ general: 'Wrong credentials, please try again' });
      } else return res.status(500).json({ error: err.code });
    });
});

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
  db.collection('usuarios').doc(req.body.username).set(newUser)
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
  db.collection('usuarios').doc(req.body.username).update(updateUser)
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
  db.collection('usuarios').doc(req.body.username).delete()
  .then (doc => {
     res.json({message: 'User deleted successfully'});
     return res;
  })
  .catch(err => {
    res.status(500).json({error: 'Something went wrong'});
    console.error(err);
  })
})

//   ██████╗ ██████╗ ███╗   ███╗███╗   ███╗███████╗███╗   ██╗████████╗███████╗
//  ██╔════╝██╔═══██╗████╗ ████║████╗ ████║██╔════╝████╗  ██║╚══██╔══╝██╔════╝
//  ██║     ██║   ██║██╔████╔██║██╔████╔██║█████╗  ██╔██╗ ██║   ██║   ███████╗
//  ██║     ██║   ██║██║╚██╔╝██║██║╚██╔╝██║██╔══╝  ██║╚██╗██║   ██║   ╚════██║
//  ╚██████╗╚██████╔╝██║ ╚═╝ ██║██║ ╚═╝ ██║███████╗██║ ╚████║   ██║   ███████║
//   ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚═╝     ╚═╝╚══════╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝


// CREATE a new user with a POST request. Takes input from body in JSON format.
app.post('/createComment', (req, res) => {
 // Take data from request body
 const newComment = {
   usuario: req.body.usuario,
   graffiti: req.body.graffiti,
   comentario: req.body.comentario,
 }

 // Add a document to the collection with id of the username, use object newUser
 db.collection('comentarios').doc().set(newComment)
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
  db.collection('comentarios').doc(req.body.id).update(updateComment)
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
  db.collection('comentarios').doc(req.body.id).delete()
  .then (doc => {
     res.json({message: 'Comment deleted successfully'});
     return res;
  })
  .catch(err => {
    res.status(500).json({error: 'Something went wrong'});
    console.error(err);
  })
})



//   ██████╗ ██████╗  █████╗ ███████╗███████╗██╗████████╗██╗███████╗
//  ██╔════╝ ██╔══██╗██╔══██╗██╔════╝██╔════╝██║╚══██╔══╝██║██╔════╝
//  ██║  ███╗██████╔╝███████║█████╗  █████╗  ██║   ██║   ██║███████╗
//  ██║   ██║██╔══██╗██╔══██║██╔══╝  ██╔══╝  ██║   ██║   ██║╚════██║
//  ╚██████╔╝██║  ██║██║  ██║██║     ██║     ██║   ██║   ██║███████║
//   ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝     ╚═╝   ╚═╝   ╚═╝╚══════╝


 // CREATE a new grafitti with a POST request. Takes input from body in JSON format.
 // Requires access token, refer to function AuthenticationMiddleware
 app.post('/createGraffiti', AuthenticationMiddleware, (req, res) => {
  // Take data from request body
  const newGraffiti = {
    autor: req.user.username,
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
  db.collection('graffitis').add(newGraffiti)
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
app.get('/graffitis',  (req, res) => {
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
  db.collection('graffitis').doc(req.body.id).update(updateGraffiti)
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
  db.collection('graffitis').doc(req.body.id).delete()
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
app.post('/graffiti/:graffitiId/likeGraffiti', (request, response) => {
  const likeDoc = db.collection('likes').where('usuario', '==', request.body.username)
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
                usuario: request.body.username
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
app.post('/graffiti/:graffitiId/unlikeGraffiti', (request, response) => {
  const likeDoc = db.collection('likes').where('usuario', '==', request.body.username)
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

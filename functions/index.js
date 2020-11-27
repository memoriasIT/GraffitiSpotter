const functions = require('firebase-functions');

const { getAllGraffitis, postGraffiti } = require('./handlers/graffitis');

const { 
  signup,
  login,
  getDetailsOfUser,
  listUsers,
  updateUser,
  deleteUser,
  } = require('./handlers/usuarios');

const { skatebmx } = require('./handlers/skatebmx');
const { container } = require('./handlers/container');
const { ecopunto } = require('./handlers/ecopunto');

const AuthenticationMiddleware = require('./util/AuthenticationMiddleware');

// Express to manage calls
const express = require('express');
const app = express();

// Defining CORS
app.use(function(req, res, next) {
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

const { toNamespacedPath } = require('path');



//  ██╗   ██╗███████╗███████╗██████╗ ███████╗
//  ██║   ██║██╔════╝██╔════╝██╔══██╗██╔════╝
//  ██║   ██║███████╗█████╗  ██████╔╝███████╗
//  ██║   ██║╚════██║██╔══╝  ██╔══██╗╚════██║
//  ╚██████╔╝███████║███████╗██║  ██║███████║
//   ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝╚══════╝
//  CRUD for the 'usuarios' collection              

app.post('/signup', signup);
app.post('/login', login);
app.get('/users', AuthenticationMiddleware, listUsers);
app.put('/updateUser', AuthenticationMiddleware, updateUser);
app.get('/user', AuthenticationMiddleware, getDetailsOfUser);
app.delete('/deleteUser', AuthenticationMiddleware, deleteUser);


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


// Middleware checks for access token, refer to .util/AuthenticationMiddleware.js
app.post('/createGraffiti', AuthenticationMiddleware, postGraffiti);
app.get('/graffitis',  getAllGraffitis);

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


app.get('/skatebmx', skatebmx)


//--------------------------------------------------------------------------------------
//
//
//  Returns the nearest paper container and his type from a position given the in request
//
//
//--------------------------------------------------------------------------------------


app.get('/container', container) 


//---------------------------------------------------------------------
//
//
//  Returns data (In particular a high res picture) of the nearest Ecopunto
//    
//
//--------------------------------------------------------------------


app.get('/ecopunto', ecopunto) 


// https://url.com/api/....
exports.api = functions.https.onRequest(app);

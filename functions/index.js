const functions = require('firebase-functions');

const { 
    getAllGraffitis, 
    postGraffiti, 
    updateGraffiti,
    deleteGraffiti,
    likeGraffiti,
    unlikeGraffiti,
    } = require('./handlers/graffitis');

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
var cors = require('cors')
app.use(cors())

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
app.put('/updateGraffiti', updateGraffiti);
app.delete('/deleteGraffiti', deleteGraffiti);
app.post('/graffiti/:graffitiId/likeGraffiti', likeGraffiti);
app.post('/graffiti/:graffitiId/unlikeGraffiti', unlikeGraffiti);


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

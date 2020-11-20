const functions = require('firebase-functions');

// Used to get access to the database
const admin = require('firebase-admin');
admin.initializeApp();

// Express to manage calls
const express = require('express');
const app = express();


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



// https://url.com/api/....
exports.api = functions.https.onRequest(app);
const functions = require('firebase-functions');

// Used to get access to the database
const admin = require('firebase-admin');
admin.initializeApp();

// Express to manage calls
const express = require('express');
const app = express();

// List all users
app.get('/users', (req, res) => {
  admin
  .firestore()
  .collection('usuarios')
  .get()
  .then((data) => {
    let users = [];
    data.forEach((doc) => {
      users.push(doc.data());
    });
    
    return res.json(users);
  })
  .catch(err => console.error(err));
});


 // Creates a new user with a POST request. Takes input from body in JSON format.
app.post('/createUser', (req, res) => {
  const newUser = {
    biografia: req.body.biografia,
    edad: req.body.edad,
    imagen: "123",
    nombre: req.body.nombre,
    password: req.body.password,
    username: req.body.username,
  }

  admin.firestore().collection('usuarios').add(newUser)
  .then (doc => {
     res.json({message: 'User created successfully'});
     return res;
  })
  .catch(err => {
    res.status(500).json({error: 'Something went wrong'});
    console.error(err);
  })


})


// https://url.com/api/....
exports.api = functions.https.onRequest(app);
const functions = require('firebase-functions');

// Used to get access to the database
const admin = require('firebase-admin');
admin.initializeApp();
// const db = admin.firestore();

// // Simple hello world to test the app
exports.helloWorld = functions.https.onRequest((request, response) => {
   functions.logger.info("Hello logs!", {structuredData: true});
   response.send("Hello from Firebase!");
 });



 // Lists all users
 exports.getUsers = functions.https.onRequest((req, res) => {
    admin.firestore().collection('usuarios').get()
      .then((data) => {
        let users = [];
        data.forEach((doc) => {
          users.push(doc.data());
        });
        
        return res.json(users);
      })
      .catch(err => console.error(err));

 })


 // Creates a new user with a POST request. Takes input from body in JSON format.
exports.createUser = functions.https.onRequest((req, res) => {
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
  })
  .catch(err => {
    res.status(500).json({error: 'Something went wrong'});
    console.error(err);
  })

})
const functions = require('firebase-functions');

// Used to get access to the database
const admin = require('firebase-admin');
admin.initializeApp();

// Simple hello world to test the app
exports.helloWorld = functions.https.onRequest((request, response) => {
   functions.logger.info("Hello logs!", {structuredData: true});
   response.send("Hello from Firebase!");
 });



//  exports.getUsers = functions.https.onRequest((req, res) => {
//     admin.firestore().collection('usuarios').get()
//       let users = [];    
//     data.forEach = [];
//     })
//  })
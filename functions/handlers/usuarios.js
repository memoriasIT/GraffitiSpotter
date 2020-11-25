const { db } = require('../util/admin');

// Auth
const firebase = require('firebase');
var firebaseConfig = require('../util/config');
firebase.initializeApp(firebaseConfig);

const { validateSignupData, validateLoginData } = require('../util/validators');


exports.signup = (req, res) => {
    // Create object from request inputs
    const newUser = {
      email: req.body.email,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
      username: req.body.username
    };
  
    // Validate data
    const { valid, errors } = validateSignupData(newUser);
    if (!valid) return res.status(400).json(errors);
  
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
  }


exports.login = (req, res) => {
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
  

    // Validate data
    const { valid, errors } = validateLoginData(user);
    if (!valid) return res.status(400).json(errors);

    
  
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
  }
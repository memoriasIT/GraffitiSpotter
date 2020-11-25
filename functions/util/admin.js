// Used to get access to the database
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

module.exports = {admin, db};
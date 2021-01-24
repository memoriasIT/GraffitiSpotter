const { db, admin } = require('./admin');

module.exports = (req, res, next) => {
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
        console.log(decodedToken);
        var data = db
          .collection('usuarios')
          .where('userId', '==', req.user.uid)
          .limit(1)
          .get();
        
        // console.log(data);
        return data;

      })
      .then((data) => {
        // console.log(data);
        // console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
        // console.log(data.docs)

        req.user.username = data.docs[0].data().username;
        return next();
      })
      // TODO also catch TypeError when no user found: Error while verifying token  TypeError: Cannot read property 'data' of undefined
      .catch((err) => { // not valid, blacklisted, etc.
        console.error('Error while verifying token ', err);
        return res.status(403).json(err);
      });
  };
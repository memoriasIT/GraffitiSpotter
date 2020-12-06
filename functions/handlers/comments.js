const { db, admin } = require('../util/admin');

exports.getComments = (req, res) => {
    admin
    .firestore()
    .collection('comentarios')
    .orderBy('graffiti')
    .get()
    .then((data) => {
      let comments = [];
      data.forEach((doc) => {
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
}


exports.createComment = (req, res) => {
    // Take data from request body
    const newComment = {
      usuario: req.body.usuario,
      graffiti: req.body.graffiti,
      comentario: req.body.comentario,
    }
    db.collection('comentarios').doc().set(newComment)
    .then (doc => {
       res.json({message: 'Comment created successfully'});
       return res;
    })
    .catch(err => {
      res.status(500).json({error: 'Something went wrong'});
      console.error(err);
    })
}

exports.updateComment =  (req, res) => {
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
}

exports.deleteComment = (req, res) => {
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
}

exports.getCommentsByGraffiti = (req, res) => {
    db
    .collection('comentarios')
    .where('graffiti', '==', req.params.graffitiId)
    .get()
    .then((data) => {
      let comments = [];
      data.forEach((doc) => {
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
}

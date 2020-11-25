const { db, admin } = require('../util/admin');

exports.getAllGraffitis = (req, res) => {
    admin
    .firestore()
    .collection('graffitis')
    .orderBy('fecha')
    .get()
    .then((data) => {
      let graffitis = [];
      data.forEach((doc) => {
        // Push an object to response with all graffiti parameters
        graffitis.push({
          id: doc.id,
          body: doc.data().body,
          autor: doc.data().autor.id,
          commentCount: doc.data().commentCount,
          descripcion: doc.data().descripcion,
          estado: doc.data().estado,
          fecha: doc.data().fecha,
          imagen: doc.data().imagen,
          likeCount: doc.data().likeCount,
          localizacion: doc.data().localizacion,
          tematica: doc.data().tematica,
          titulo: doc.data().titulo,
        });
      });
      
      // Give response in JSON format
      return res.json(graffitis);
    })
    .catch(err => console.error(err));
  }


exports.postGraffiti = (req, res) => {
    // Take data from request body
    const newGraffiti = {
      autor: req.user.username,
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
  
    // Add a document to the collection, use object newGraffiti
    db.collection('graffitis').add(newGraffiti)
    .then (doc => {
       res.json({message: 'Graffiti created successfully'});
       return res;
    })
    .catch(err => {
      res.status(500).json({error: 'Something went wrong'});
      console.error(err);
    })
  }
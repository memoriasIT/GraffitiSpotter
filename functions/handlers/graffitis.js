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
          autor: doc.data().autor,
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

exports.getGraffiti = (req, res) => {
    admin
    .firestore()
    .collection('graffitis')
    .doc(req.params.graffitiId)
    .get()
    .then((doc) => {
      let graffitis = [];
        // Push an object to response with all graffiti parameters
        graffitis.push({
          id: doc.id,
          body: doc.data().body,
          autor: doc.data().autor,
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
      fecha: new Date().toISOString,
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

// UPDATE an existing graffiti given a id
exports.updateGraffiti =  (req, res) => {
  // Take data from request body
  const updateGraffiti = {
    autor: req.body.autor,
    commentCount: req.body.commentCount,
    descripcion: req.body.descripcion,
    estado: req.body.estado,
    //fecha: req.body.fecha,
    imagen: req.body.imagen,
    likeCount: req.body.likeCount,
    localizacion: req.body.localizacion,
    tematica: req.body.tematica,
    titulo: req.body.titulo,
  }

  // Add a document to the collection with id of the graffiti, use object updateGraffiti
  db.collection('graffitis').doc(req.body.id).update(updateGraffiti)
  .then (doc => {
     res.json({message: 'Graffiti updated successfully'});
     return res;
  })
  .catch(err => {
    res.status(500).json({error: 'Something went wrong'});
    console.error(err);
  })
}

// DELETE an existing graffiti given a id
exports.deleteGraffiti = (req, res) => {
  // Deletes a document with the id provided in body request
  db.collection('graffitis').doc(req.body.id).delete()
  .then (doc => {
     res.json({message: 'Graffiti deleted successfully'});
     return res;
  })
  .catch(err => {
    res.status(500).json({error: 'Something went wrong'});
    console.error(err);
  })
}

//Like/unlike a graffiti
exports.likeGraffiti = (request, response) => {
  const likeDoc = db.collection('likes').where('usuario', '==', request.user.username)
      .where('graffiti', '==', request.params.graffitiId).limit(1);

  const graffitiDoc = db.doc(`/graffitis/${request.params.graffitiId}`);

  let graffitiData;

  graffitiDoc.get()
    .then(doc => {
        if(doc.exists) {
            graffitiData = doc.data();
            graffitiData.graffitiId = doc.id;
            return likeDoc.get();
        } else {
            return response.status(404).json({error : 'Graffiti no encontrado'});
        }
    })
    .then(data => {
        if(data.empty) {
            return db.collection('likes').add({
                graffiti : request.params.graffitiId,
                usuario: request.user.username
            })
            .then(() => {
                graffitiData.likeCount++
                return graffitiDoc.update({likeCount: graffitiData.likeCount})
            })
            .then(() => {
                return response.json(graffitiData);
            })
        } else {
          return db.doc(`/likes/${data.docs[0].id}`).delete()
          .then(() =>{
              graffitiData.likeCount--;
              return graffitiDoc.update({likeCount: graffitiData.likeCount});
          })
          .then(() => {
              return response.json(graffitiData);
          })
        }
    })
    .catch(err => {
        console.error(err)
        return response.status(500).json({error: err.code});
    })
}


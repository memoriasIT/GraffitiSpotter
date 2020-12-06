const functions = require('firebase-functions');

const { 
    getAllGraffitis, 
    getGraffiti,
    postGraffiti, 
    updateGraffiti,
    deleteGraffiti,
    likeGraffiti,
    unlikeGraffiti,
    } = require('./handlers/graffitis');

const { 
  signup,
  login,
  getDetailsOfUser,
  listUsers,
  updateUser,
  deleteUser,
  } = require('./handlers/usuarios');

const {
    getComments,
    createComment,
    updateComment,
    deleteComment,
    getCommentsByGraffiti,
    } = require('./handlers/comments');

const { skatebmx } = require('./handlers/skatebmx');
const { container } = require('./handlers/container');
const { ecopunto } = require('./handlers/ecopunto');

const AuthenticationMiddleware = require('./util/AuthenticationMiddleware');

// Express to manage calls
const express = require('express');
const app = express();

// Defining CORS
var cors = require('cors')
app.use(cors())

const { toNamespacedPath } = require('path');



//  ██╗   ██╗███████╗███████╗██████╗ ███████╗
//  ██║   ██║██╔════╝██╔════╝██╔══██╗██╔════╝
//  ██║   ██║███████╗█████╗  ██████╔╝███████╗
//  ██║   ██║╚════██║██╔══╝  ██╔══██╗╚════██║
//  ╚██████╔╝███████║███████╗██║  ██║███████║
//   ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝╚══════╝
//  CRUD for the 'usuarios' collection              

app.post('/signup', signup);
app.post('/login', login);
app.get('/users', AuthenticationMiddleware, listUsers);
app.put('/updateUser', AuthenticationMiddleware, updateUser);
app.get('/user', AuthenticationMiddleware, getDetailsOfUser);
app.delete('/deleteUser', AuthenticationMiddleware, deleteUser);


//   ██████╗ ██████╗ ███╗   ███╗███╗   ███╗███████╗███╗   ██╗████████╗███████╗
//  ██╔════╝██╔═══██╗████╗ ████║████╗ ████║██╔════╝████╗  ██║╚══██╔══╝██╔════╝
//  ██║     ██║   ██║██╔████╔██║██╔████╔██║█████╗  ██╔██╗ ██║   ██║   ███████╗
//  ██║     ██║   ██║██║╚██╔╝██║██║╚██╔╝██║██╔══╝  ██║╚██╗██║   ██║   ╚════██║
//  ╚██████╗╚██████╔╝██║ ╚═╝ ██║██║ ╚═╝ ██║███████╗██║ ╚████║   ██║   ███████║
//   ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚═╝     ╚═╝╚══════╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝


app.post('/createComment', createComment)
app.get('/comments', getComments);
app.get('/commentsByGraffiti/:graffitiId', getCommentsByGraffiti);
app.put('/updateComment', updateComment)
app.delete('/deleteComment', deleteComment)



//   ██████╗ ██████╗  █████╗ ███████╗███████╗██╗████████╗██╗███████╗
//  ██╔════╝ ██╔══██╗██╔══██╗██╔════╝██╔════╝██║╚══██╔══╝██║██╔════╝
//  ██║  ███╗██████╔╝███████║█████╗  █████╗  ██║   ██║   ██║███████╗
//  ██║   ██║██╔══██╗██╔══██║██╔══╝  ██╔══╝  ██║   ██║   ██║╚════██║
//  ╚██████╔╝██║  ██║██║  ██║██║     ██║     ██║   ██║   ██║███████║
//   ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝     ╚═╝   ╚═╝   ╚═╝╚══════╝


// Middleware checks for access token, refer to .util/AuthenticationMiddleware.js
app.post('/createGraffiti', AuthenticationMiddleware, postGraffiti);
app.get('/graffitis',  getAllGraffitis);
app.get('/graffitis/:graffitiId',  getGraffiti);
app.put('/updateGraffiti', updateGraffiti);
app.delete('/deleteGraffiti', deleteGraffiti);
app.get('/graffiti/:graffitiId/likeGraffiti', AuthenticationMiddleware, likeGraffiti);


// ██████╗ ██████╗ ███████╗███╗   ██╗    ██████╗  █████╗ ████████╗ █████╗ 
//██╔═══██╗██╔══██╗██╔════╝████╗  ██║    ██╔══██╗██╔══██╗╚══██╔══╝██╔══██╗
//██║   ██║██████╔╝█████╗  ██╔██╗ ██║    ██║  ██║███████║   ██║   ███████║
//██║   ██║██╔═══╝ ██╔══╝  ██║╚██╗██║    ██║  ██║██╔══██║   ██║   ██╔══██║
//╚██████╔╝██║     ███████╗██║ ╚████║    ██████╔╝██║  ██║   ██║   ██║  ██║
// ╚═════╝ ╚═╝     ╚══════╝╚═╝  ╚═══╝    ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝
// Functions using open data from Ayuntamiento de Malaga                                                                        
                                                                        

//---------------------------------------------------------------------------------------
//
//
//  Returns all the skatebmx areas in a radius of x meters from a given position
//
//
//---------------------------------------------------------------------------------------


app.get('/skatebmx', skatebmx)


//--------------------------------------------------------------------------------------
//
//
//  Returns the nearest paper container and his type from a position given the in request
//
//
//--------------------------------------------------------------------------------------


app.get('/container', container) 


//---------------------------------------------------------------------
//
//
//  Returns data (In particular a high res picture) of the nearest Ecopunto
//    
//
//--------------------------------------------------------------------


app.get('/ecopunto', ecopunto) 


// https://url.com/api/....
exports.api = functions.https.onRequest(app);

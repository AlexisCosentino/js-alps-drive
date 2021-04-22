console.log('hello la famille je suis le server');
let express = require('express');
const os = require('os');
const fs = require('fs');
const path = require('path');
const drive = require('./drive');
const { fileURLToPath } = require('url');
const isAlphanumeric = require('is-alphanumeric')
const bb = require('express-busboy');



let app = express();
let port = 3000
let alps_drive = os.tmpdir() + ''

app.use(express.static('frontend'))

function start() {
  console.log('OK, le serveur est HTTP est lancé')
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get('/api/drive', function (req, res) {
  drive.listFolder(drive.ALPS_DRIVE).then((result) => {
    res.send(result);
  }).catch((error) => {
    res.status(404).send(error.message);
  })
})

////////////////////////////

app.get('/api/drive/:name', function (req, res) {
  drive.listFolder(drive.ALPS_DRIVE + req.params.name).then((result) => {
    res.send(result);
  }).catch((error) => {
    res.status(404).send(error.message);
  })
})


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Pouvoir creer un nouveau dossier

app.post('/api/drive', function (req, res) {
  if (isAlphanumeric(req.query.name) == false) {
    res.status(400).send('erreur ma gueule')
  } else {
    drive.createFolder(drive.ALPS_DRIVE, req.query.name).then((result) => {
      res.status(201).send(result);
    })
  }
})

// Pouvoir creer un nouveau dossier dans les dossiers enfants

app.post('/api/drive/:name', function (req, res) {
  if (isAlphanumeric(req.query.name) == false) {
    res.status(400).send('erreur ma gueule')
  } else {
    drive.createFolder(drive.ALPS_DRIVE + req.params.name, req.query.name).then((result) => {
      res.status(201).send(result);
    }).catch((error) => {
      res.status(404).send(error.message);
    })
  }
})

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Pouvoir supprimer un dossier ou un fichier

app.delete('/api/drive/:name', function (req, res) {
  if (isAlphanumeric(req.params.name) == false) {
    res.status(400).send('erreur ma gueule')
  } else {
    drive.deleteFolder(drive.ALPS_DRIVE, req.params.name).then((result) => {
      res.status(201).send(result);
    }).catch((error) => {
      res.status(404).send(error.message);
    })
  }
})

////Pouvoir supprimer un dossier ou un fichier dans un dossier enfant

app.delete('/api/drive/:name/:second', function (req, res) {
  if (isAlphanumeric(req.params.second) == false) {
    res.status(400).send('erreur ma gueule')
  } else {
    drive.deleteFolder(drive.ALPS_DRIVE + req.params.name, req.params.second).then((result) => {
      res.status(201).send(result);
    }).catch((error) => {
      res.status(404).send(error.message);
    })
  }
})

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////Pouvoir ajouter un fichier

//J'utilise et initialise Busboy
bb.extend(app, {
  upload: true,
  path: path.join(os.tmpdir(), 'busboy/'),
});

app.put('/api/drive', function (req, res) {
  console.log(isAlphanumeric('text.txt'))
  drive.addFile(req.files.file.filename, drive.ALPS_DRIVE, req.files.file.file).then((result) => {
    res.status(201).send(result);
  })
})

app.put('/api/drive/:name', function (req, res) {
  drive.addFile(req.files.filename, drive.ALPS_DRIVE + req.params.name, req.files.file.file).then((result) => {
    res.status(201).send(result);
  })
})

//////////////

module.exports = {
  start: start,
}

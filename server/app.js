const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const multer = require('multer')
const upload = multer();
const dbconf = require('./../config').db
const mongoose = require('mongoose')
const cors = require('cors')
const csrf = require('csurf')
const cookieParser = require('cookie-parser')

const routes = require('./routes/index')

async function start() {
  try {
    let db = await mongoose.connect(`mongodb://${dbconf.login}:${dbconf.pass}@127.0.0.1:27017/clientbook`, { useNewUrlParser: true })
    app.use(cors());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser())
    app.use(csrf({ cookie: true }))
    app.use(bodyParser.json());

    app.use(`/clients`, routes.clients);
    app.use(`/childrens`, routes.childrens);
    app.use(`/mc`, routes.masterclasses);
    app.use(`/projects`, routes.projects);
    routes.inventory.init(app, '/inventory')

    app.get(`/`, upload.array(), (req, res) => {
      res.send('OK')
    });
    return app
  } catch (error) {
    console.error(error)
    return false
  }
}

module.exports = start()
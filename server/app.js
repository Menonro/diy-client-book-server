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

const passport = require('passport');

const routes = require('./routes/index')

async function start() {
  try {
    let db = await mongoose.connect(`mongodb://${dbconf.login}:${dbconf.pass}@127.0.0.1:27017/clientbook`, { useNewUrlParser: true })
    app.use(cors());
    // app.use(csrf({ cookie: true }))
    app.use(passport.initialize());
    require('./passport-config')(passport);

    app.use(cookieParser());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    app.use((req, res, next) => {
      if (req.body) console.info(req.body);
      if (req.params) console.info(req.params);
      if (req.query) console.info(req.query);
      console.info(`Received a ${req.method} request from ${req.ip} for ${req.url}`);
      next();
    });

    app.use(`/user`, routes.user);
    app.use(`/clients`, passport.authenticate('jwt', { session: false }), routes.clients);
    app.use(`/childrens`, passport.authenticate('jwt', { session: false }), routes.childrens);
    app.use(`/mc`, passport.authenticate('jwt', { session: false }), routes.masterclasses);
    app.use(`/projects`, passport.authenticate('jwt', { session: false }), routes.projects);
    app.use(`/inventory`, passport.authenticate('jwt', { session: false }), routes.inventory);

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
// routes/user.js
const router = require('express').Router()
//Initializes an instance of the Router class.
const User = require('../models/User');
const bcrypt = require('bcryptjs');
//imports the user model and the BcryptJS Library
// BcryptJS is a no setup encryption tool
// require('dotenv').config();
const secret = /*process.env.SECRET ||*/ 'ArkenSecretKey';
//gives us access to our environment variables 
//and sets the secret object.
const passport = require('passport');
const jwt = require('jsonwebtoken');
//imports Passport and the JsonWebToken library for some utilities
router.post('/register', (req,res) => {
   User.findOne({emailAddress: req.body.emailAddress})
   .then(user => {
      if (user){
         let error = 'Email Address Exists in Database.';
         return res.status(400).json(error);
      } else {
         const errs = []
         if (!req.body.name) errs.push('name')
         if (!req.body.emailAddress) errs.push('emailAddress')
         if (!req.body.password) errs.push('password')
         if (errs.length > 0) return res.status(400).json({ errors: errs })
         const newUser = new User({
            name: req.body.name,
            emailAddress: req.body.emailAddress,
            password: req.body.password
         });
         bcrypt.genSalt(10, (err, salt) => {
            if (err) throw err;
            bcrypt.hash(newUser.password, salt, (err, hash) => {
               if (err) throw err;
               newUser.password = hash;
               newUser.save().then(user => res.json(user))
                  .catch(err => res.status(400).json(err));
            });
         });
      }
   })
   .catch(err => res.status(400).json(error))
});

router.post('/login', async (req, res) => {
   const email = req.body.email;
   const password = req.body.password;
   try {
      const user = await User.findOne({ email })
      if (!user) {
         errors.email = "No Account Found";
         return res.status(404).json(errors);
      }
      try {
         const isMatch = await bcrypt.compare(password, user.password)
         if (isMatch) {
            const payload = {
               id: user._id,
               name: user.userName
            };
            jwt.sign(payload, secret, { expiresIn: 36000 },
               (err, token) => {
                  if (err) res.status(500)
                     .json({
                        error: "Error signing token",
                        raw: err
                     });
                  res.json({
                     success: true,
                     token: `Bearer ${token}`
                  });
               }
            );
         } else {
            errors.password = "Password is incorrect";
            res.status(400).json(errors);
         }
      } catch (error) {
         return res.status(400).json(error);
      }
   } catch (error) {
      return res.status(404).json(error);
   }
   
});

module.exports = router;
'use strict';

const express = require('express');
const router = express.Router();
const usersCrud = require('./users-crud');

router.post(
    '/user',
    usersCrud.addUserInfo, (req, res, next) => {
      res.json({
        message: req.my_result.message,
        dev_message: req.my_result.dev_message,
        user: req.my_result.user
      });
    });



router.get('/user/:id', usersCrud.getSpecificUser, (req, res, next) => {
  res.json({
    message: req.my_result.message,
    dev_message: req.my_result.dev_message,
    user: req.my_result.user
  });
});


module.exports = router
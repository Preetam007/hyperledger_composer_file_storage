'use strict';
const express = require('express');
const router = express.Router();
const drugCrud = require('./assets-crud.js');
const multer   = require('multer');
/**
 *  [Remember] if storage key not not given then we will get image data in buffer in req.files
 */
const cpUpload = multer({
  // multer settings
  limits: { fileSize:20*1024*1024 },
  //storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype !== 'application/pdf' && file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/jpe' && file.mimetype !== 'image/jpg') {
      req.fileValidationError = 'goes wrong on the mimetype';
      return cb(null, false);
    }
    cb(null, true);
  }
}).single('ipfs');


router.post('/',cpUpload,
  drugCrud.uploadDrug);


router.get('/:id',
    drugCrud.getSpecificDrug);

module.exports = router;

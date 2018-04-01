'use strict';

const returnError = (data, err, res) => {
  return res.json({ error: { message: data, dev_message: err } });
};

module.exports = {
  returnError
};

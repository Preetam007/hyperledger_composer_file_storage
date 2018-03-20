'use strict';
const USER_NS = 'org.example.biznet';
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const fs = require('fs');
const path = require('path');
const addUserInfo = (req, res, next) => {
  let businessNetworkConnection = new BusinessNetworkConnection();
  let user;

  return businessNetworkConnection.connect('admin@composer-file-stroage')
      .then(() => {
        return businessNetworkConnection.getParticipantRegistry(
            USER_NS + '.User');
      })
      .then(userRegistry => {
        let factory =
            businessNetworkConnection.getBusinessNetwork().getFactory();
        user = factory.newResource(USER_NS, 'User', req.body.email);
        user.image = fs.readFileSync(path.resolve(__dirname + `/sample.${req.body.type}`))
                         .toString('base64');

        return userRegistry.add(user);
      })
      .then(() => {
        return businessNetworkConnection.disconnect();
      })
      .then(() => {
        req.my_result = {};
        req.my_result.dev_message = 'Success';
        req.my_result.message = 'User has been added successfully';
        next();
      })
      .catch(err => {
        return res.json({
          error: {
            message: 'Failed to create new User',
            dev_message: err.message
          }
        });
      });
};

const getSpecificUser = (req, res, next) => {
  let businessNetworkConnection = new BusinessNetworkConnection();
  let user;
  let assets;
  let exists;
  return businessNetworkConnection
      .connect('admin@composer-file-stroage')  // Auth module will add
      .then(() => {
        return businessNetworkConnection.getParticipantRegistry(
            USER_NS + '.User');
      })
      .then(userRegistry => {
        assets = userRegistry;
        return userRegistry.exists(req.params.id);
      })
      .then((result) => {
        exists = result;
        if (result) {
          return assets.get(req.params.id);
        }
      })
      .then((result) => {
        if (exists) {
          user = businessNetworkConnection.getBusinessNetwork()
                     .getSerializer()
                     .toJSON(result);
        }
        return businessNetworkConnection.disconnect();
      })
      .then(() => {
        req.my_result = {};
        if (exists) {
          req.my_result.user = user;
          req.my_result.dev_message = 'Success';
          req.my_result.message = 'User has been retrieved successfully';
        } else {
          req.my_result.dev_message = 'Success';
          req.my_result.message = 'No such user found';
        }

        next();
      })
      .catch(err => {
        return res.json({
          error: {
            message: 'Failed to find  User',
            dev_message: err.message
          }
        });
      });
};

module.exports = {
  addUserInfo,
  getSpecificUser
};
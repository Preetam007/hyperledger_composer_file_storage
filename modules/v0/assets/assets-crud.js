'use strict';
const misc = require.cache.misc;
//using the infura.io node, otherwise ipfs requires you to run a //daemon on your own computer/server

const IPFS = require('ipfs-api');
const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

//run with local daemon

// const ipfsApi = require('ipfs-api');
// const ipfs = new ipfsApi('localhost', '5001', { protocol:'http' });
const ASSET_NS = 'org.preetam.composer';
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;

const uploadDrug = (req, res, next) => {

  if (req.fileValidationError) {
    misc.returnError('Failed to upload new image', req.fileValidationError, res);
  } else {
    ipfs.add(req.file.buffer, (err,resd) => {
      if (err) {
        misc.returnError('Failed to upload new image', err.message, res);
      } else {
        const businessNetworkConnection = new BusinessNetworkConnection();
        let drug;
        return businessNetworkConnection.connect('admin@composer-file-stroage-ways')
            .then(() => {
              return businessNetworkConnection.getAssetRegistry(
                  `${ASSET_NS}.Drug`);
            })
            .then(assetRegistry => {
              const factory = businessNetworkConnection.getBusinessNetwork().getFactory();
              drug = factory.newResource(ASSET_NS, 'Drug', req.body.containerId);
              drug.containerImage = `https://ipfs.io/ipfs/${resd[0].hash}`;
              return assetRegistry.add(drug);
            })
            .then(() => {
              return businessNetworkConnection.disconnect();
            })
            .then(() => {
              res.json({
                message: 'Drug has been added successfully',
                dev_message: 'Success'
              });
            })
            .catch(errs => {
              return res.json({
                error: {
                  message: 'Failed to create new Drug',
                  dev_message: errs.message
                }
              });
            });
      }
    });
  }
};

const getSpecificDrug = (req, res, next) => {
  const businessNetworkConnection = new BusinessNetworkConnection();
  let drug;
  let assets;
  let exists;
  return businessNetworkConnection
      .connect('admin@composer-file-stroage-ways')  // Auth module will add
      .then(() => {
        return businessNetworkConnection.getAssetRegistry(
            `${ASSET_NS}.Drug`);
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
          drug = businessNetworkConnection.getBusinessNetwork()
                     .getSerializer()
                     .toJSON(result);
        }
        return businessNetworkConnection.disconnect();
      })
      .then(() => {
        if (exists) {
          res.json({
            drug : drug,
            message: 'Drug has been retrieved successfully',
            dev_message: 'Success'
          });
        } else {
          res.json({
            message: 'There is no such drug exists',
            dev_message: 'Success'
          });
        }
      })
      .catch(err => {
        return res.json({
          error: {
            message: 'Failed to find  drug',
            dev_message: err.message
          }
        });
      });
};

module.exports = {
  uploadDrug,
  getSpecificDrug
};

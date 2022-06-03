const path = require('path');
const grpc = require('grpc');
const loaderConfig = require('../config/proto');
const protoLoader = require('@grpc/proto-loader');

const nixDefinition = protoLoader.loadSync(
    path.resolve(__dirname, '..', 'pb', 'nix.proto'),
    loaderConfig
);

const nix = grpc.loadPackageDefinition(nixDefinition);

const nixClient = new nix.PurchaseService('localhost:3335', grpc.credentials.createInsecure());

module.exports = nixClient;
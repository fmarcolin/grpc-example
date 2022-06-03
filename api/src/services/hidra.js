const path = require('path');
const grpc = require('grpc');
const loaderConfig = require('../config/proto');
const protoLoader = require('@grpc/proto-loader');

const hidraDefinition = protoLoader.loadSync(
    path.resolve(__dirname, '..', 'pb', 'hidra.proto'),
    loaderConfig
);

const hidra = grpc.loadPackageDefinition(hidraDefinition);

const hidraClient = new hidra.UserService('localhost:3334', grpc.credentials.createInsecure());

module.exports = hidraClient;
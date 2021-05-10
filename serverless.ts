import type { AWS } from '@serverless/typescript';

import { getPayments, getOnePayment } from '@api/payments';

const serverlessConfiguration: AWS = {
  service: 'sls-ts-tester',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: ['serverless-webpack', 'serverless-offline'],
  provider: {
    name: 'aws',
    region: 'eu-west-2',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
    lambdaHashingVersion: '20201221',
  },
  functions: { getPayments, getOnePayment },
};

module.exports = serverlessConfiguration;

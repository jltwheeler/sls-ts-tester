import * as AWS from 'aws-sdk';
import { Entity, Table } from 'dynamodb-toolbox';

const { DynamoDB } = AWS;

export const paymentTableName = 'payments-table';
export const paymentTableConfig = {
  endpoint: 'http://localhost:8000',
  region: 'eu-west-2',
  accessKeyId: 'accesskey',
  secretAccessKey: 'password',
};

const DocumentClient = new DynamoDB.DocumentClient(paymentTableConfig);

export const PaymentsTable = new Table({
  name: paymentTableName,
  partitionKey: 'paymentId',
  sortKey: 'status',
  attributes: {
    paymentId: 'number',
    status: 'string',
  },
  DocumentClient,
});

export const Payment = new Entity({
  name: 'Payment',
  attributes: {
    paymentId: { partitionKey: true, type: 'number' },
    status: { sortKey: true, type: 'string' },
  },
  timestamps: true,
  created: 'createdAt',
  modified: 'modifiedAt',
  table: PaymentsTable,
});

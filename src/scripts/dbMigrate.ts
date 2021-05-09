import { DynamoDB } from 'aws-sdk';
import { paymentTableConfig, paymentTableName } from '@models/payments';

const paymentTableDefinition: DynamoDB.CreateTableInput = {
  TableName: paymentTableName,
  AttributeDefinitions: [
    {
      AttributeType: 'N',
      AttributeName: 'paymentId',
    },
    {
      AttributeType: 'S',
      AttributeName: 'status',
    },
  ],
  KeySchema: [
    {
      AttributeName: 'paymentId',
      KeyType: 'HASH',
    },
    {
      AttributeName: 'status',
      KeyType: 'RANGE',
    },
  ],
  BillingMode: 'PROVISIONED',
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1,
  },
};

(async () => {
  const dynamo = new DynamoDB(paymentTableConfig);

  try {
    await dynamo.createTable(paymentTableDefinition).promise();
  } catch (error) {
    console.log(error);
  }
})();

import 'source-map-support/register';

import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

const payments = [
  { id: 1, amount: 300, createdAt: new Date(2021, 2, 1) },
  { id: 2, amount: 500, createdAt: new Date(2021, 2, 2) },
];

const getAllPayments = async () => {
  return formatJSONResponse({
    data: payments,
  });
};

export const main = middyfy(getAllPayments);

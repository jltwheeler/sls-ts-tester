import 'source-map-support/register';

import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { logger } from '@libs/logger';

const payments = [
  { id: 1, amount: 300, createdAt: new Date(2021, 2, 1) },
  { id: 2, amount: 500, createdAt: new Date(2021, 2, 2) },
];

const getOnePayment = async (event: any) => {
  logger.debug(event, '/ request');

  const id = parseInt(event.pathParameters.id);
  const payment = payments.find((payment) => payment.id === id);

  if (!payment) {
    const message = `Error: payment id ${id} does not exist`;
    logger.error(message);
    return formatJSONResponse({
      data: message,
    });
  }

  logger.info(payment, `Payment for id: ${id}`);

  logger.debug(payment, '/ response');
  return formatJSONResponse({
    data: payment,
  });
};

export const main = middyfy(getOnePayment);

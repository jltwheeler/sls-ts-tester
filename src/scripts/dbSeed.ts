import { Payment, PaymentsTable } from '@models/payments';

const items = [
  {
    paymentId: 1,
    status: 'pending',
  },
  {
    paymentId: 1,
    status: 'succeeded',
  },
];

const input = items.map((item) => Payment.putBatch(item));

(async () => await PaymentsTable.batchWrite(input))();

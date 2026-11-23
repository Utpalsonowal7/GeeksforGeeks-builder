const test = require('node:test');
const assert = require('node:assert/strict');

const orders = require('../lib/orders');
const ledger = require('../lib/ledger');

function sampleOrders() {
  return [
    { id: 1001, date: '28/12/2021', customer: 'Meera Joshi' },
    { id: 1004, date: '30/01/2022', customer: 'Kalyani Foods' },
    { id: 1007, date: '04/03/2022', customer: 'Suresh Deshmukh' },
    { id: 1008, date: '15/03/2022', customer: 'Walk-in' }
  ];
}

test('FIXED BEHAVIOUR: order list sorts newest dates first', () => {
  const result = orders.list({ orders: sampleOrders() }, {});

  assert.deepEqual(result.map((order) => order.id), [1008, 1007, 1004, 1001]);
});

test('FIXED BEHAVIOUR: January date range includes only January orders', () => {
  const result = orders.list({ orders: sampleOrders() }, {
    from: '2022-01-01',
    to: '2022-01-31'
  });

  assert.deepEqual(result.map((order) => order.id), [1004]);
});

test('FIXED BEHAVIOUR: string settlement amounts are numerically added', () => {
  const db = {
    nextSettlementId: 505,
    customers: [{
      id: 1,
      name: 'Meera Joshi',
      openingBalance: 450,
      totalBilled: 1982.01,
      totalSettled: 1200
    }],
    settlements: []
  };

  const result = ledger.recordSettlement(db, 1, '500', 'cash', 'Part payment');

  assert.equal(result.customer.totalSettled, 1700);
  assert.equal(result.customer.balance, 732.01);
});

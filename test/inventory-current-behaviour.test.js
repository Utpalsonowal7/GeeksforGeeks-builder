const test = require('node:test');
const assert = require('node:assert/strict');

const inventory = require('../lib/inventory');

test('FIXED BEHAVIOUR: inventory accepts quantity equal to sellable stock', () => {
  const products = [{ id: 6, name: 'Ghee', stock: 1, reserved: 0 }];

  const result = inventory.check(products, [{ id: 6, qty: 1 }]);

  assert.equal(result.ok, true);
});

test('FIXED BEHAVIOUR: release restores stock for order line ids', () => {
  const products = [{ id: 6, name: 'Ghee', stock: -1, reserved: 0 }];

  inventory.release(products, [{ id: 6, qty: 2 }]);

  assert.equal(products[0].stock, 1);
  assert.equal(products[0].reserved, 0);
});


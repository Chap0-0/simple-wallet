const assert = require("assert");

describe("deposit", function () {
  it("should increase the balance and add a deposit transaction", function () {
    const initialBalance = 0;
    const depositAmount = 100;
    let balance = initialBalance;
    let transactions = [];

    function updateBalance() {
      balance += depositAmount;
    }

    function updateTransactionHistory() {
      const transaction = {
        type: "Пополнение",
        amount: depositAmount.toFixed(2),
        time: new Date().toLocaleString(),
      };
      transactions.push(transaction);
    }
    updateBalance();
    updateTransactionHistory();

    assert.strictEqual(balance, initialBalance + depositAmount);
    assert.strictEqual(transactions.length, 1);
    assert.deepStrictEqual(transactions[0], {
      type: "Пополнение",
      amount: "100.00",
      time: new Date().toLocaleString(),
    });
  });
});

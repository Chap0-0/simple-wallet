const assert = require("assert");
describe("withdraw", function () {
  it("should decrease the balance and add a withdrawal transaction", function () {
    // Arrange
    const initialBalance = 100;
    const withdrawAmount = 50;
    let balance = initialBalance;
    let transactions = [];

    function updateBalance() {
      if (withdrawAmount > balance) {
        return false;
      }
      balance -= withdrawAmount;
      return true;
    }

    function updateTransactionHistory() {
      const transaction = {
        type: "Вывод",
        amount: "-" + withdrawAmount.toFixed(2),
        time: new Date().toLocaleString(),
      };
      transactions.push(transaction);
    }

    // Act
    const withdrawalAllowed = updateBalance();
    if (withdrawalAllowed) {
      updateTransactionHistory();
    }

    // Assert
    assert.strictEqual(balance, initialBalance - withdrawAmount);
    assert.strictEqual(transactions.length, 1);
    assert.deepStrictEqual(transactions[0], {
      type: "Вывод",
      amount: "-50.00",
      time: new Date().toLocaleString(),
    });
  });

  it("should not allow withdrawal if the amount exceeds the balance", function () {
    // Arrange
    const initialBalance = 100;
    const withdrawAmount = 200;
    let balance = initialBalance;
    let transactions = [];
    let alertMessage = "";

    function updateBalance() {
      if (withdrawAmount > balance) {
        alertMessage = "Недостаточно средств на балансе";
        return false;
      }
      balance -= withdrawAmount;
      return true;
    }

    function updateTransactionHistory() {
      const transaction = {
        type: "Вывод",
        amount: "-" + withdrawAmount.toFixed(2),
        time: new Date().toLocaleString(),
      };
      transactions.push(transaction);
    }

    // Act
    const withdrawalAllowed = updateBalance();
    if (withdrawalAllowed) {
      updateTransactionHistory();
    }

    // Assert
    assert.strictEqual(balance, initialBalance);
    assert.strictEqual(transactions.length, 0);
    assert.strictEqual(alertMessage, "Недостаточно средств на балансе");
  });
});

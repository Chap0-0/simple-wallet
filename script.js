let balance = 0;
let transactions = [];

if (localStorage.getItem("balance")) {
  balance = parseFloat(localStorage.getItem("balance"));
}

if (localStorage.getItem("transactions")) {
  transactions = JSON.parse(localStorage.getItem("transactions"));
}

updateBalance();
updateTransactionHistory();

function getExchangeRate() {
  // Отправка запроса к API для получения текущего курса валют
  fetch("api.json")
    .then((response) => response.json())
    .then((data) => {
      // Обработка полученных данных
      // Доступ к текущему курсу валют
      const exchangeRateUSD = data.USD.Value;
      rubToUsdRate = 1 / exchangeRateUSD;
      const exchangeRateEUR = data.EUR.Value;
      rubToEurRate = 1 / exchangeRateEUR;
    })
    .catch((error) => {
      console.log("Ошибка при получении данных: ", error);
    });
}
getExchangeRate();

function updateBalance() {
  document.getElementById("balance").innerText = balance.toFixed(2);
  localStorage.setItem("balance", balance.toFixed(2));

  let currencySelect = document.getElementById("currency");

  currencySelect.selectedIndex = 0;

  currencySelect.addEventListener("change", updateConvertedBalance);

  function updateConvertedBalance() {
    let currency = currencySelect.value;
    let convertedBalance = 0;

    if (currency === null) {
      ("Выберите валюту");
    } else if (currency === "USD") {
      convertedBalance = balance * rubToUsdRate;
    } else if (currency === "EUR") {
      convertedBalance = balance * rubToEurRate;
    }

    document.getElementById("convertedBalance").innerText =
      convertedBalance.toFixed(3) + currency;
  }
}

function updateTransactionHistory() {
  let transactionHistory = "";
  for (let transaction of transactions.reverse()) {
    transactionHistory +=
      transaction.type +
      ": " +
      transaction.amount +
      " (" +
      transaction.time +
      ")\n";
  }
  transactions.reverse();
  document.getElementById("transactionHistory").innerText = transactionHistory;
}

function deposit() {
  let depositAmount = parseFloat(
    document.getElementById("depositAmount").value
  );

  if (isNaN(depositAmount) || depositAmount < 0) {
    alert("Введите корректную положительную сумму депозита");
    return;
  }

  balance += depositAmount;
  let transaction = {
    type: "Пополнение",
    amount: depositAmount.toFixed(2),
    time: new Date().toLocaleString(),
  };
  transactions.push(transaction);
  updateBalance();
  updateTransactionHistory();
  saveTransactionsToLocalStorage();
  alert("Сумма депозита успешно зачислена на ваш баланс");
  document.getElementById("depositAmount").value = "";
}

function withdraw() {
  let withdrawAmount = parseFloat(
    document.getElementById("withdrawAmount").value
  );

  if (isNaN(withdrawAmount) || withdrawAmount < 0) {
    alert("Введите корректную положительную сумму вывода");
    return;
  }

  if (withdrawAmount > balance) {
    alert("Недостаточно средств на балансе");
    return;
  }

  balance -= withdrawAmount;
  let transaction = {
    type: "Вывод",
    amount: "-" + withdrawAmount.toFixed(2),
    time: new Date().toLocaleString(),
  };
  transactions.push(transaction);
  updateBalance();
  updateTransactionHistory();
  saveTransactionsToLocalStorage();
  alert("Сумма вывода успешно списана с вашего баланса");
  document.getElementById("withdrawAmount").value = "";
}

function viewHistory() {
  if (transactions.length === 0) {
    alert("Ваша история транзакций:\n\n(Пока что пусто)");
  } else {
    let transactionHistory = "Ваша история транзакций:\n\n";
    for (let i = 0; i < transactions.length; i++) {
      let transaction = transactions[i];
      transactionHistory +=
        transaction.type +
        ": " +
        transaction.amount +
        " (" +
        transaction.time +
        ")\n";
    }
    alert(transactionHistory);
  }
}

function saveTransactionsToLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

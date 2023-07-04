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
let rubToUsdRate = 1 / 89.42;
let rubToEurRate = 1 / 97.66;
//Функция ниже, использует апи ЦБР и передает данные валют(её использовать только если есть возможность использовать localhost vscode или openserver, ну и если есть возможность достать ссылку на апи)
// function getExchangeRate() {
//   // Отправка запроса к API для получения текущего курса валют
//   fetch("https://www.cbr-xml-daily.ru/daily_json.js")
//     .then((response) => response.json())
//     .then((data) => {
//       // Обработка полученных данных
//       // Доступ к текущему курсу валют
//       const exchangeRateUSD = data.Valute.USD.Value;
//       rubToUsdRate = 1 / exchangeRateUSD;
//       const exchangeRateEUR = data.Valute.EUR.Value;
//       rubToEurRate = 1 / exchangeRateEUR;
//     })
//     .catch((error) => {
//       console.log("Ошибка при получении данных: ", error);
//     });
// }
// getExchangeRate();

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

function saveTransactionsToLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

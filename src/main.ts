import Account from "./lib/account";
import config from "./DB/config.json";

// Авторизация аккаунта при помощи параметра authorization из хедеров запросов к рабам
const account = new Account(config.authorization);

account.updateInfo().then(() => {
	// Вывод в консоль информации о вашем аккаунте
	console.log(account.info);
});

// Логика работы бота здесь

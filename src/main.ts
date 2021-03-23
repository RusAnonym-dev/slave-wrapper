import Account from "./lib/account";
import config from "./DB/config.json";

const account = new Account(config.authorization);

account.updateInfo().then(() => {
	console.log(account.info);
});

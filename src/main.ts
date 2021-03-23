import * as scheduler from "simple-scheduler-task";

import Account from "./lib/account";
import Slave from "./lib/slave";
import config from "./DB/config.json";

const account = new Account(config.authorization);

new Slave(124124, config.authorization).buy().then((res) => console.log(res));

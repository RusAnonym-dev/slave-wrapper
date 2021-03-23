import axios from "axios";
import * as utils from "rus-anonym-utils";

import { AccountInfoResponse } from "./../types/account";
import { sendLog } from "./logger";
import Slave from "./slave";

interface AccountParams {
	chain: boolean;
	work: boolean;
}
export default class Account {
	private authorization: string;
	private params: AccountParams;

	public slaves: Slave[] = [];
	public info: {
		balance: number;
		profit: number;
		clearProfit: number;
		reservMoney: number;
	} = {
		balance: 0,
		profit: 0,
		clearProfit: 0,
		reservMoney: 0,
	};

	constructor(
		authorization: string,
		params: AccountParams = {
			chain: true,
			work: true,
		},
	) {
		this.authorization = authorization;
		this.params = params;
	}

	public async updateInfo(): Promise<AccountInfoResponse> {
		const accountInfo = (
			await axios.get(
				"https://pixel.w84.vkforms.ru/HappySanta/slaves/1.0.0/start",
				{
					headers: {},
				},
			)
		).data as AccountInfoResponse;

		this.slaves = accountInfo.slaves.map((slave) => {
			const tempSlave = new Slave(slave.id, this.authorization, {
				id: slave.id,
				job: slave.job.name,
				profit: slave.profit_per_min,
				clear_profit: 0,
				sale_price: slave.sale_price,
				fetter_price: slave.fetter_price,
				fetter_to: new Date(slave.fetter_to * 1000),
			});

			tempSlave.chain = this.params.chain;
			tempSlave.work = this.params.work;

			return tempSlave;
		});

		this.info.balance = accountInfo.me.balance;
		this.info.profit = accountInfo.me.slaves_profit_per_min;

		if (this.slaves.length > 0) {
			this.info.clearProfit = this.slaves
				.map((slave) => slave.calculateProfit())
				.reduce((accumulator, currentValue) => accumulator + currentValue);

			this.info.reservMoney = this.slaves
				.map((slave) => slave.data.fetter_price)
				.reduce((accumulator, currentValue) => accumulator + currentValue);
		} else {
			this.info.clearProfit = 0;
			this.info.reservMoney = 0;
		}

		sendLog(`Обновил данные в ${new Date().toLocaleString()}
Баланс: ${this.info.balance}
Доход: ${this.info.profit}
Чистый доход: ${this.info.clearProfit}
Рабов: ${this.slaves.length}
Резерв: ${this.info.reservMoney}

Резерв заполнится примерно через ${Math.floor(
			(this.info.reservMoney - this.info.balance) / this.info.clearProfit,
		)} минут`);
		return accountInfo;
	}

	public async checkSlaves() {
		for (const slave of this.slaves) {
			if (slave.chain === true && slave.data.fetter_to < new Date()) {
				await slave.buyFetter();
			}
			if (slave.work === true && slave.data.job === "") {
				await slave.setJob();
			}
		}
	}
}

import axios from "axios";

import {
	GetResponse,
	BuyResponse,
	SellResponse,
	BuyFetterResponse,
	SetJobResponse,
} from "./../types/slave";
import { sendLog } from "./logger";

interface SlaveData {
	id: number;
	job: string;
	profit: number;
	clear_profit: number;
	sale_price: number;
	fetter_price: number;
	fetter_to: Date;
}

export default class Slave {
	private id: number;
	private authorization: string;

	public readonly data: SlaveData = {
		id: 0,
		job: "",
		profit: 0,
		clear_profit: 0,
		sale_price: 0,
		fetter_price: 0,
		fetter_to: new Date(0),
	};

	public chain: boolean = true;
	public work: boolean = true;

	constructor(id: number, authorization: string, data?: SlaveData) {
		this.id = id;
		this.authorization = authorization;
		if (data) {
			this.data = data;
			this.calculateProfit();
		}
	}

	public calculateProfit(): number {
		const clearProfit = this.data.profit - this.data.fetter_price / 120;
		this.data.clear_profit = clearProfit;
		return clearProfit;
	}

	public async get(): Promise<GetResponse> {
		const slaveInfo = (
			await axios.get(
				`https://pixel.w84.vkforms.ru/HappySanta/slaves/1.0.0/user?id=${this.id}`,
				{
					headers: {
						authorization: this.authorization,
					},
				},
			)
		).data as GetResponse;

		this.data.id = slaveInfo.id;
		this.data.job = slaveInfo.job.name;
		this.data.profit = slaveInfo.profit_per_min;
		this.data.sale_price = slaveInfo.sale_price;
		this.data.fetter_price = slaveInfo.fetter_price;
		this.data.fetter_to = new Date(slaveInfo.fetter_to * 1000);

		if (this.chain === true && this.data.fetter_to < new Date()) {
			await this.buyFetter();
		}

		return slaveInfo;
	}

	public async buy(): Promise<BuyResponse> {
		const data = (
			await axios.post(
				"https://pixel.w84.vkforms.ru/HappySanta/slaves/1.0.0/buySlave",
				{
					slave_id: this.id,
				},
				{
					headers: {
						authorization: this.authorization,
					},
				},
			)
		).data;
		await this.get();
		sendLog(`Куплен раб @id${this.data.id}
Работа: ${this.data.job}
Доход: ${this.data.profit}
Чистый доход: ${this.data.clear_profit}
Стоимость цепи: ${this.data.fetter_price}
Можно продать за ${this.data.fetter_price}`);
		return data;
	}

	public async sell(): Promise<SellResponse> {
		const data = (
			await axios.post(
				"https://pixel.w84.vkforms.ru/HappySanta/slaves/1.0.0/saleSlave",
				{
					slave_id: this.id,
				},
				{
					headers: {
						authorization: this.authorization,
					},
				},
			)
		).data as SellResponse;
		sendLog(`Продан раб @id${this.data.id}
Работа: ${this.data.job}
Доход: ${this.data.profit}
Чистый доход: ${this.data.clear_profit}
Стоимость цепи: ${this.data.fetter_price}
Продан за ${this.data.fetter_price}`);
		return data;
	}

	public async buyFetter(): Promise<BuyFetterResponse> {
		const data = (
			await axios.post(
				"https://pixel.w84.vkforms.ru/HappySanta/slaves/1.0.0/buyFetter",
				{
					slave_id: this.id,
				},
				{
					headers: {
						authorization: this.authorization,
					},
				},
			)
		).data as BuyFetterResponse;
		this.data.id = data.id;
		this.data.job = data.job.name;
		this.data.profit = data.profit_per_min;
		this.data.sale_price = data.sale_price;
		this.data.fetter_price = data.fetter_price;
		this.data.fetter_to = new Date(data.fetter_to * 1000);
		sendLog(`Куплена цепь на @id${this.data.id}
Работа: ${this.data.job}
Доход: ${this.data.profit}
Чистый доход: ${this.data.clear_profit}
Стоимость цепи: ${this.data.fetter_price}
Можно продать за ${this.data.sale_price}`);
		return data;
	}

	public async setJob(work = `work #${this.id}`): Promise<SetJobResponse> {
		const data = (
			await axios.post(
				"https://pixel.w84.vkforms.ru/HappySanta/slaves/1.0.0/jobSlave",
				{
					slave_id: this.id,
					name: work,
				},
				{
					headers: {
						authorization: this.authorization,
					},
				},
			)
		).data.slave as SetJobResponse;
		this.data.id = data.id;
		this.data.job = data.job.name;
		this.data.profit = data.profit_per_min;
		this.data.sale_price = data.sale_price;
		this.data.fetter_price = data.fetter_price;
		this.data.fetter_to = new Date(data.fetter_to * 1000);
		sendLog(`Установлена новая работа для @id${this.data.id}
Работа: ${this.data.job}
Новая работа: ${work}
Доход: ${this.data.profit}
Чистый доход: ${this.data.clear_profit}
Стоимость цепи: ${this.data.fetter_price}
Можно продать за ${this.data.fetter_price}`);
		return data;
	}
}

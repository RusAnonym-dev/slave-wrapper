import fetch from "node-fetch";

import {
	GetResponse,
	BuyResponse,
	SellResponse,
	BuyFetterResponse,
	SetJobResponse,
} from "./../types/slave";

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

	constructor(id: number, authorization: string, data?: SlaveData) {
		this.id = id;
		this.authorization = authorization;
		if (data) {
			this.data = data;
			this.calculateClearProfit();
		}
	}

	public calculateClearProfit(): number {
		const clearProfit = this.data.profit - this.data.fetter_price / 120;
		this.data.clear_profit = clearProfit;
		return clearProfit;
	}

	public async get(): Promise<GetResponse> {
		const response = (await (
			await fetch(
				`https://pixel.w84.vkforms.ru/HappySanta/slaves/1.0.0/user?id=${this.id}`,
				{
					headers: {
						authorization: this.authorization,
					},
				},
			)
		).json()) as GetResponse;

		this.data.id = response.id;
		this.data.job = response.job.name;
		this.data.profit = response.profit_per_min;
		this.data.sale_price = response.sale_price;
		this.data.fetter_price = response.fetter_price;
		this.data.fetter_to = new Date(response.fetter_to * 1000);

		return response;
	}

	public async buy(): Promise<BuyResponse> {
		const response = await (
			await fetch(
				"https://pixel.w84.vkforms.ru/HappySanta/slaves/1.0.0/buySlave",
				{
					headers: {
						authorization: this.authorization,
					},
					body: JSON.stringify({
						slave_id: this.id,
					}),
				},
			)
		).json();
		return response;
	}

	public async sell(): Promise<SellResponse> {
		const response = await (
			await fetch(
				"https://pixel.w84.vkforms.ru/HappySanta/slaves/1.0.0/saleSlave",
				{
					headers: {
						authorization: this.authorization,
					},
					body: JSON.stringify({
						slave_id: this.id,
					}),
				},
			)
		).json();
		return response;
	}

	public async buyFetter(): Promise<BuyFetterResponse> {
		const response = (await (
			await fetch(
				"https://pixel.w84.vkforms.ru/HappySanta/slaves/1.0.0/buyFetter",
				{
					headers: {
						authorization: this.authorization,
					},
					body: JSON.stringify({
						slave_id: this.id,
					}),
				},
			)
		).json()) as BuyFetterResponse;

		this.data.id = response.id;
		this.data.job = response.job.name;
		this.data.profit = response.profit_per_min;
		this.data.sale_price = response.sale_price;
		this.data.fetter_price = response.fetter_price;
		this.data.fetter_to = new Date(response.fetter_to * 1000);
		return response;
	}

	public async setJob(work = `work #${this.id}`): Promise<SetJobResponse> {
		const response = (await (
			await fetch(
				"https://pixel.w84.vkforms.ru/HappySanta/slaves/1.0.0/jobSlave",
				{
					headers: {
						authorization: this.authorization,
					},
					body: JSON.stringify({
						slave_id: this.id,
						name: work,
					}),
				},
			)
		).json()) as SetJobResponse;

		this.data.id = response.id;
		this.data.job = response.job.name;
		this.data.profit = response.profit_per_min;
		this.data.sale_price = response.sale_price;
		this.data.fetter_price = response.fetter_price;
		this.data.fetter_to = new Date(response.fetter_to * 1000);
		return response;
	}
}

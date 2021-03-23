export interface GetResponse {
	item_type: string;
	id: number;
	job: { name: string };
	master_id: number;
	profit_per_min: number;
	fetter_to: number;
	fetter_price: number;
	sale_price: number;
	chicken_mark: boolean;
	price: number;
	balance: number;
	duel_count: number;
	duel_win: number;
	duel_reject: number;
	chicken_mark_clean: number;
	slaves_count: number;
	rating_position: number;
	slaves_profit_per_min: number;
	was_in_app: boolean;
	fetter_hour: number;
}

export interface BuyResponse extends GetResponse {}

export interface SellResponse {
	balance: number;
}

export interface BuyFetterResponse extends GetResponse {}

export interface SetJobResponse extends GetResponse {}

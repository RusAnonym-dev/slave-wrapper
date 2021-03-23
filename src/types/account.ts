import { GetResponse } from "./slave";

export interface AccountInfoResponse {
	me: GetResponse;
	share_url: string;
	duels: [];
	slaves: GetResponse[];
	slaves_profit_per_min: number;
	just_slave: boolean;
}

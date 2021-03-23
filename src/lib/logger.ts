import { getRandomId, VK } from "vk-io";

import { config } from "./core";

const vk = new VK({
	token: config.vk.token,
	pollingGroupId: config.vk.id,
});

export async function sendLog(text: string) {
	return await vk.api.messages.send({
		random_id: getRandomId(),
		chat_id: config.vk.chat,
		message: text,
	});
}

import { Message } from "../model/model.js";

export class WebhookService {
    processWebhookData(data) {
        const message = new Message(data);

        return message;
    }
}
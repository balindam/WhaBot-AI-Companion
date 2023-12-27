import {WebhookService} from '../service/service.js';

export class WebhookController {
    constructor(app) {
        this.WebhookService = new WebhookService();
        // to verify webhook callback URL
        app.get('/webhook', this.verifyWebhookURL.bind(this));
        app.post('/webhook', this.processWebhook.bind(this));
    }

    verifyWebhookURL(req, res) {
        const mode = req.query["hub.mode"];
        const challenge = req.query["hub.challenge"];
        const token = req.query["hub.verify_token"];

        if(this.WebhookService.verifyWebhookURLToken(mode, token)) {
            res.status(200).send(challenge);
        } else {
            res.send(403);
        }
    }

    processWebhook(req, res) {
        // TODO: check which webhook is incoming and then process (switch-case)
        const webhookNotificationPayload = req.body;
        const field = webhookNotificationPayload?.entry?.changes?.field;

        switch(field) {
            case "messages":
                const messages = webhookNotificationPayload?.entry?.changes?.values?.messages;
                messages.forEach(message => {
                    if(message?.type === 'text') {
                        const messageContent = message.text.body;
                        const fromPhoneNumber = message.from;
                        this.WebhookService.sendMessageToUser(fromPhoneNumber, 'text', messageContent);
                    }
                })
                break;
            case "unknown": 
                break;
            default:
                break;
        }
        
        res.status(200).json(processedData);
    }
}
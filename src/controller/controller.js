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

    async processWebhook(req, res) {
        const webhookNotificationPayload = req.body;
        const field = webhookNotificationPayload?.entry[0]?.changes[0]?.field;
        console.log('webhookNotificationPayload', JSON.stringify(webhookNotificationPayload))
        switch(field) {
            case "messages":
                console.log('inside field')
                const messages = webhookNotificationPayload?.entry[0]?.changes[0]?.value?.messages;
                if(messages) {
                    const messageContent = messages[0].text.body;
                    const fromPhoneNumber = messages[0].from;
                    await this.WebhookService.handleWhatsAppMessage(fromPhoneNumber, messageContent);
                }
                
                break;
            case "unknown":
                break;
            default:
                break;
        }
        
        // res.status just sets the status header and not the body (also, it doesn't send back to the client,
        //  for that you will have to do res.status(200).send('error body')).
        // IMP -> res.status(200);

        // res.sendStatus(), sets the status and send it to the client (duplicates standard status message into the body)
        res.sendStatus(200);
    }
}
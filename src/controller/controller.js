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

        if(mode === 'subscribe' && token === process.env.WHATSAPP_CLOUD_API_CALLBACK_URL_TOKEN) {
            res.status(200).send(challenge);
        } else {
            res.status(403);
        }
    }

    processWebhook(req, res) {
        // TODO: check which webhook is incoming and then process (switch-case)
        const data = req.body;
        const processedData = this.WebhookService.processWebhookData(data);

        res.status(200).json(processedData);
    }
}
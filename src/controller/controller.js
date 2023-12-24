import {WebhookService} from '../service/service.js';

export class WebhookController {
    constructor(app) {
        this.WebhookService = new WebhookService();
        app.post('/webhook', this.processWebhook.bind(this));
    }

    processWebhook(req, res) {
        // TODO: check which webhook is incoming and then process (switch-case)
        const data = req.body;
        const processedData = this.WebhookService.processWebhookData(data);

        res.status(200).json(processedData);
    }
}
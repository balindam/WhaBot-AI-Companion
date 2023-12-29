import express from 'express';
import bodyParser from 'body-parser';
import { WebhookController } from './controller/controller.js';

const app = express();

// Use body-parser middleware, to handle the body parsing
// need middleware to parse incoming request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize the WebhookController
new WebhookController(app);

export const handler = ServerlessHttp(app); 
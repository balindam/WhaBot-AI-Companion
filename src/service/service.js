import { WHATSAPP_SEND_MESSAGE_URL } from "../constants.js";
import { Message } from "../model/model.js";
import axios from 'axios';
import OpenAI from 'openai';

export class WebhookService {
    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY // This is also the default, can be omitted
        });
    }

    processWebhookData(data) {
        const message = new Message(data);

        return message;
    }

    verifyWebhookURLToken(mode, token) {
        if(mode === 'subscribe' && token === process.env.WHATSAPP_CLOUD_API_CALLBACK_URL_TOKEN) {
            return true;
        } else {
            return false;
        }
    }

    async handleWhatsAppMessage(fromPhoneNumber, receivedMessage) {
        try {
            const response = await this.askOpenAI(receivedMessage);
            await this.sendMessageToUser(fromPhoneNumber, 'text', response);
        } catch (error) {
            console.error('Error handling WhatsApp message:', error);
            // Handle error, maybe send a default response
        }
    }
    
    async askOpenAI(question) {
        try {
            const completion = await this.openai.chat.completions.create({
                model: "gpt-3.5-turbo-1106",
                messages: [
                    {"role": "user", "content": question}
                ]
            });
            return completion.choices[0].message.content;
        } catch (error) {
            console.error('Error asking OpenAI:', error);
            throw new Error('Failed to get response from OpenAI');
        }
    }

    // TODO: may need to send session id in future
    async sendMessageToUser(toPhoneNumber, messageType, message) {
        try {
            const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
            const version = process.env.GRAPH_FB_VERSION;

            const messageObject = {
                "messaging_product": "whatsapp",
                "recipient_type": "individual",
                "to": `+${toPhoneNumber}`,
                "type": messageType,
                "text": { 
                    "body": message
                }
            };

            await axios.post(`${WHATSAPP_SEND_MESSAGE_URL}/${version}/${phoneNumberId}/messages`, messageObject, {
                headers: {
                    'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            });
        } catch (error) {
            console.error('Error sending message to user:', error);
            throw new Error('Failed to send message to user');
        }
    }
}
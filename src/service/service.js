import { GRAPH_FB_VERSION, WHATSAPP_SEND_MESSAGE_URL } from "../constants.js";
import { Message } from "../model/model.js";
import axios from 'axios';

export class WebhookService {
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
    
    // TODO: may need to send session id in future
    async sendMessageToUser(toPhoneNumber, messageType, message) {
        const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
        const version = process.env.GRAPH_FB_VERSION;

        const messageObject = {
            "messaging_product": "whatsapp",
            "recipient_type": "individual",
            "to": toPhoneNumber,
            "type": "text",
            "text": { 
            "body": message
            }
        }

        axios.post(`${WHATSAPP_SEND_MESSAGE_URL}/${version}/${phoneNumberId}/messages`, messageObject, {
            headers: {
                'content-type': 'application/json',
                'authorization': process.env.ACCESS_TOKEN,
            }
        })
    }
}
import {clients} from "../constants/index.js";
import {getHtmlService} from "../service/index.js";

export async function checkUpdates() {
    const htmlService = getHtmlService();
    const { html, status } = await htmlService.invalidateHtmlContent();

    if (status) {
        clients.forEach(res => res.write(
            `data: ${JSON.stringify({ html })}\n\n`
        ))

    }
}
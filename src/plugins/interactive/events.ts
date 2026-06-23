import { Client } from 'zaileys';
import { Plugin } from '../../types.js';

export const interactiveEventsPlugin: Plugin = {
  name: 'interactive-events',
  setup(client: Client) {
    // 1. Event: Button Click
    client.on('button-click', (payload) => {
      console.log(`[Button Click] ID: ${payload.buttonId}, Text: ${payload.buttonText || '-'}, Sender: ${payload.sender.jid}`);
    });

    // 2. Event: List Selection
    client.on('list-select', (payload) => {
      console.log(`[List Select] Row ID: ${payload.rowId}, Title: ${payload.title || '-'}, Sender: ${payload.sender.jid}`);
    });

    // 3. Event: Poll Vote
    client.on('poll-vote', (payload) => {
      console.log(`[Poll Vote] Selected: ${payload.selectedOptions.join(', ')}, Voter: ${payload.voter.jid}`);
    });
  }
};

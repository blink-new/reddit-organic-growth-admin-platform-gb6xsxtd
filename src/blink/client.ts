import { createClient } from '@blinkdotnew/sdk';

const projectId = import.meta.env.VITE_BLINK_PROJECT_ID;

if (!projectId) {
  throw new Error('VITE_BLINK_PROJECT_ID is not set. Please add it to your .env file.');
}

export const blink = createClient({
  projectId,
  authRequired: true,
});

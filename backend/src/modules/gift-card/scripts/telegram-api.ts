import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import input from 'input';
import { Api } from 'telegram/tl';
import { config } from '../../../config';

const apiId = 27660986;
const apiHash = '6a124c2b7a6c0ba5cae7edd0868b404f';
const stringSession = new StringSession(config.TG_SESSION);
/* (async () => {
  console.log('Loading interactive example...');
  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });
  await client.start({
    phoneNumber: async () => await input.text('Please enter your number: '),
    password: async () => await input.text('Please enter your password: '),
    phoneCode: async () =>
      await input.text('Please enter the code you received: '),
    onError: (err) => console.log(err),
  });
  console.log(client.session.save());
  console.log('You should now be connected.');
  client.session.save(); // Save this string to avoid logging in again
  await client.sendMessage('me', { message: 'Hello!' });
})(); */
export async function sendQRMessage({
  phone,
  imagePath,
  text,
}: {
  phone: string;
  imagePath: string;
  text: string;
}) {
  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });
  await client.connect();
  const contactInfo = await client.getEntity(phone);
  if (contactInfo && contactInfo.id) {
    await client.sendFile(contactInfo.id, {
      file: imagePath,
      caption: text,
      parseMode: 'html',
    });
  }
}

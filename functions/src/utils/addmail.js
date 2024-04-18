/* eslint-disable operator-linebreak */
import { logger } from 'firebase-functions';
import admin from 'firebase-admin';

export const addMail = async ({ to, mail_template, data }) => {
  const msg = {
    to,
    template: {
      name: mail_template,
      data: { ...data }
    }
  };

  await admin
    .firestore()
    .collection('mail')
    .add(msg)
    .then(() => {
      return null;
    })
    .catch((error) => {
      logger.error(`Failed to add record to mail collection - error ${error}`);
      throw new Error(
        `Failed adding document to mail collection. mail_template: ${mail_template}, data: ${JSON.parse(
          { ...data }
        )}`
      );
    });
};

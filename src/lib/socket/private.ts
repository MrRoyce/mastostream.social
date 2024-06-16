
import { SESSION_ID } from "$lib/constants";
interface SendSuccess {
  message: string;
}

interface SendError {
  error: string;
}

export function leavePrivate({ acct, socket, sessionID }) {
  console.log(`leavePrivate - acct: ${acct}, sessionID: ${sessionID}.`)
  return new Promise((
    resolve: (value: SendSuccess) => void,
    reject: (value: SendError) => void
  ) => {
    socket.emit('leave private', { acct, sessionID }, (response: any) => {
      const error = response.error;

      if (error) {
        console.error('Error in leavePrivate ', error)
        if (typeof error !== "string") {
          reject({ error: "Error leavePrivate room in private" });
          return;
        }
        reject({ error });
        return;
      }

      resolve({
        message: ""
      })
    })
  })
}

export async function connectSocket({ acct, socket, uid }) {

  const sessionID = localStorage.getItem(SESSION_ID);
  console.log(`Private connecting socket to acct: ${acct}, sessionID: ${sessionID}.`)
  return new Promise((
    resolve: (value: SendSuccess) => void,
    reject: (value: SendError) => void
  ) => {

    socket.auth = {
      sessionID,
      uid,
      username: acct,
    };

    try {
      socket.connect();

      resolve({
        message: "Socket connected"
      })
    } catch (error) {
      console.error('Error connecting to socket', error)
      if (typeof error !== "string") {
        reject({ error: "Error connecting scocket in private" });
        return;
      }
      reject({ error });
      return;
    }
  })
}

export function sendMessage({ content, from, fromUserName, socket, to, userName }) {
  return new Promise(
    (
      resolve: (value: SendSuccess) => void,
      reject: (value: SendError) => void
    ) => {
      console.log(`sendMessage content: ${content}, from: ${from}, to: ${to}, userName: ${userName},`)

      socket.emit("private message", { content, from, fromUserName, to, userName }, (response: any) => {
        const error = response.error;

        if (error) {
          console.error('Error in private message ', error)
          if (typeof error !== "string") {
            reject({ error: "Error sending message in private" });
            return;
          }
          reject({ error });
          return;
        }

        const message = response.message;
        if (!message || typeof message !== "string") {
          reject({ error: "Unexpected result from private in sendMessage" });
          return;
        }

        resolve({ message });
      });
    }
  );
}

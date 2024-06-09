import { io } from "socket.io-client";
import {
  type ChatRoom,
  type ChatMessage,
  validateChatRoom,
  validateChatMessage,
  type PrivateMessage
} from "$lib/models";
import {
  chatRoomsStore, chatNumUsers,
  chatUsersStore, privateMessagesStore
} from "$lib/stores";
import { PUBLIC_PRIVATE_HOST, PUBLIC_SOCKET_HOST } from '$env/static/public'
import { dev } from "$app/environment";
import { validatePrivateUser, type ChatPrivateUser } from "$lib/models/chatUser";
import { validatePrivateChatMessage } from "$lib/models/chatMessage";

// Retry https://socket.io/docs/v4/tutorial/step-8
const ioOptions = {
  // ackTimeout: 10000,
  // retries: 3,
  autoConnect: false,
  path: ''
}

if (!dev) {
  ioOptions.path = "/private"
}

function unixEpochToDateString(unixEpoch) {
  // Create a new Date object using the Unix epoch (convert seconds to milliseconds)
  const date = new Date(unixEpoch * 1000);

  // Extract the date components
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const day = String(date.getDate()).padStart(2, '0');

  // Extract the time components
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  // Format the date and time as YYYY-MM-DD HH:MM:SS
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

const socketAddr = dev ? `${PUBLIC_PRIVATE_HOST}` : `${PUBLIC_SOCKET_HOST}`
console.log('socketAddr', socketAddr)
const socket = io(socketAddr, ioOptions);

socket.on("connect_error", (err) => {
  // the reason of the error, for example "xhr poll error"
  console.error("connect_error - private - err.message:", err.message);

  // some additional description, for example the status code of the initial HTTP response
  console.error("connect_error - private - err.description:", err.description);

  // some additional context, for example the XMLHttpRequest object
  console.error("connect_error - private - err.context:", err.context);
});

socket.on("session", ({ connected, createdAt, sessionID, uid, userID, username }) => {
  console.log(`Private session - connected: ${connected}, createdAt: ${createdAt}, sessionID: ${sessionID}, uid: ${uid}, userID: ${userID}, username: ${username}.`)
  // attach the session ID to the next reconnection attempts
  socket.auth = { sessionID };
  // store it in the localStorage
  localStorage.setItem("sessionID", sessionID);
  // save the ID of the user
  socket.userID = userID;
});

socket.on("connect", () => {
  console.debug("Successfully connected to private socket");
});

socket.on("updateRooms", (rooms) => {
  if (!Array.isArray(rooms)) {
    return;
  }

  const validatedRooms: ChatRoom[] = [];

  const limitedRooms = rooms.filter((_, index) => {
    return index < 25;
  });

  for (const room of limitedRooms) {
    const validatedRoom = validateChatRoom(room);

    if (validatedRoom) {
      validatedRooms.push(validatedRoom);
    }
  }

  chatRoomsStore.set(validatedRooms);
})

socket.on("updateChat", (data) => {
  const { acct, message, time, type } = data
  const validatedMessage: ChatMessage | undefined = validateChatMessage({ content: message, userName: acct, type: type });

  if (validatedMessage) {
    validatedMessage.time = time
    privateMessagesStore.update((items) => {
      items.push(validatedMessage)
      return items
    })
  }

})

socket.on("updateCount", (id, count) => {
  chatNumUsers.set(count)
  console.log(`Num users: ${id}, count: ${count}.`)
})

socket.on("user connected", (user) => {
  console.log('user connected', user)
})

socket.on("updateUsers", (users) => {
  const validatedUsers: ChatPrivateUser[] = [];
  console.log('users in updateUsers', users)

  for (const user of users) {
    const validatedUser = validatePrivateUser(user);

    if (validatedUser) {
      validatedUsers.push(validatedUser);

    } else {
      console.log('invalid user', user)
    }
  }

  chatUsersStore.set(validatedUsers);
})

socket.on("connect_error", (err) => {
  if (err.message === "No username") {
    console.error('Error connecting socket!', err);
  }
  socket.off("connect_error");
});

socket.on("private message", (message: { content: string; createdAt: string; from: string; fromUserName: string; to: string; userName: string; }) => {
  const { content, createdAt, from, fromUserName, to, userName } = message

  console.log('message in private message', message)

  if (!content || !from || !to || typeof (content) !== 'string' || typeof (from) !== 'string' || typeof (fromUserName) !== 'string' || typeof (to) !== 'string' || typeof (userName) !== 'string') {
    console.error('Invalid private message', message)
    return;
  }

  const createdAtDate = unixEpochToDateString(createdAt)

  const response = {
    content, createdAt: createdAtDate, from, fromUserName, to, userName
  }

  privateMessagesStore.update((items) => {
    items.push(response)
    return items
  })
})

socket.on("user disconnected", (user) => {
  console.log('user disconnected', user)
})

socket.on("messages", (messages) => {
  if (!Array.isArray(messages)) {
    return;
  }

  const validatedMessages: PrivateMessage[] = [];
  const limitedMessages = messages.filter((_, index) => {
    return index < 25;
  });

  for (const message of limitedMessages) {
    const validatedMessage = validatePrivateChatMessage(message);
    if (validatedMessage) {
      const createdAtDate = unixEpochToDateString(validatedMessage.createdAt)
      validatedMessage.createdAt = createdAtDate
      validatedMessages.push(validatedMessage);
    }
  }

  privateMessagesStore.set(validatedMessages);
});

interface SendSuccess {
  message: string;
}

interface SendError {
  error: string;
}

export function leavePrivate({ acct, sessionID }) {

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

export function connectSocket({ acct, uid }) {
  console.log('private connectSocket to acct:', acct)
  const sessionID = localStorage.getItem("sessionID");
  socket.auth = {
    sessionID,
    uid,
    username: acct,
  };
  socket.connect();
}

export function sendMessage({ content, from, fromUserName, to, userName }) {
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

export function createUser({ acct, group, sessionId, type, uid }: CreateUserOptions) {
  return new Promise(
    (
      resolve: (value: SendSuccess) => void,
      reject: (value: SendError) => void
    ) => {
      const options = { acct, group, sessionId, type, uid }
      socket.emit("createUser", options, (response: any) => {
        const error = response.error;

        if (error) {
          console.error('Error in createUser ', error)
          if (typeof error !== "string") {
            reject({ error: "Error sending message for createUser in private" });
            return;
          }
          reject({ error });
          return;
        }

        const message = response.message;
        if (!message || typeof message !== "string") {
          reject({ error: "Unexpected result from private in createUser" });
          return;
        }

        resolve({ message });
      });
    }
  );
}

export function leaveRoom({ roomId }) {
  return new Promise(
    (
      resolve: (value: SendSuccess) => void,
      reject: (value: SendError) => void
    ) => {
      // Notify socket that person left room
      socket.emit("leaveRoom",
        roomId
        , (response: any) => {
          const error = response.error;

          if (error) {
            console.error('Error in leaveRoom ', error)
            if (typeof error !== "string") {
              reject({ error: "Error leaving room in private" });
              return;
            }
            reject({ error });
            return;
          }

          const message = response.message;
          if (!message || typeof message !== "string") {
            reject({ error: "Unexpected result from private in leaveRoom" });
            return;
          }

          resolve({ message });
        });
    }
  );
}

export function createRoom({
  acct,
  mature,
  name,
  roomId,
  type
}) {

  return new Promise(
    (
      resolve: (value: SendSuccess) => void,
      reject: (value: SendError) => void
    ) => {
      // Notify socket that a room was created
      socket.emit("createRoom", {
        acct,
        mature,
        name,
        roomId,
        type,
      }, (response: any) => {
        const error = response.error;

        if (error) {
          console.error('Error in createRoom ', error)
          if (typeof error !== "string") {
            reject({ error: "Error sending message" });
            return;
          }
          reject({ error });
          return;
        }

        const message = response.message;
        if (!message || typeof message !== "string") {
          reject({ error: "Unexpected result from server in createRoom" });
          return;
        }

        resolve({ message });
      });
    }
  );
}
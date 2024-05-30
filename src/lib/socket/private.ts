import { io } from "socket.io-client";
import {
  type ChatRoom,
  type ChatUser,
  type ChatMessage,
  validateChatRoom,
  validateChatMessage
} from "$lib/models";
import {
  chatRoomsStore, chatNumUsers,
  chatUsersStore, chatMessagesStore
} from "$lib/stores";
import { PUBLIC_PRIVATE_HOST, PUBLIC_SOCKET_HOST } from '$env/static/public'
import { dev } from "$app/environment";
import { validatePrivateUser } from "$lib/models/chatUser";

// Retry https://socket.io/docs/v4/tutorial/step-8
const ioOptions = {
  // ackTimeout: 10000,
  // retries: 3,
  autoConnect: false
}
const socket = io(dev ? `${PUBLIC_PRIVATE_HOST}` : `${PUBLIC_SOCKET_HOST}/private`, ioOptions);

socket.on("session", ({ sessionID, userID, users }) => {
  console.log('sessionID in private session', sessionID)
  console.log('userID in private session', userID)
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
    chatMessagesStore.update((items) => {
      items.push(validatedMessage)
      return items
    })
  }

})

socket.on("updateCount", (id, count) => {
  chatNumUsers.set(count)
  console.log(`Num users: ${id}, count: ${count}.`)
})

socket.on("updateUsers", (users) => {
  const validatedUsers: ChatUser[] = [];
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

socket.on("messages", (messages) => {
  if (!Array.isArray(messages)) {
    return;
  }

  const validatedMessages: ChatMessage[] = [];
  const limitedMessages = messages.filter((_, index) => {
    return index < 25;
  });

  for (const message of limitedMessages) {
    const validatedMessage = validateChatMessage(message);
    if (validatedMessage) {
      validatedMessages.push(validatedMessage);
    }
  }

  chatMessagesStore.set(validatedMessages);
});

interface SendSuccess {
  message: string;
}

interface SendError {
  error: string;
}

export function connectSocket({ acct, uid }) {
  console.log('private connectSocket to acct:', acct)
  const sessionID = localStorage.getItem("sessionID");
  socket.auth = { username: acct, sessionID, uid };
  socket.connect();
}

export function sendMessage({ acct, content }) {
  return new Promise(
    (
      resolve: (value: SendSuccess) => void,
      reject: (value: SendError) => void
    ) => {
      socket.emit("sendMessage", { acct, content }, (response: any) => {
        const error = response.error;

        if (error) {
          console.error('Error in sendMessage ', error)
          if (typeof error !== "string") {
            reject({ error: "Error sending message" });
            return;
          }
          reject({ error });
          return;
        }

        const message = response.message;
        if (!message || typeof message !== "string") {
          reject({ error: "Unexpected result from server in sendMessage" });
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
            reject({ error: "Error sending message for createUser" });
            return;
          }
          reject({ error });
          return;
        }

        const message = response.message;
        if (!message || typeof message !== "string") {
          reject({ error: "Unexpected result from server in createUser" });
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
              reject({ error: "Error sending message" });
              return;
            }
            reject({ error });
            return;
          }

          const message = response.message;
          if (!message || typeof message !== "string") {
            reject({ error: "Unexpected result from server in leaveRoom" });
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
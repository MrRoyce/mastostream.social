import { io } from "socket.io-client";
import {
  type ChatRoom,
  type ChatUser,
  type ChatMessage,
  validateChatRoom,
  validateChatUser,
  validateChatMessage
} from "$lib/models";
import {
  chatRoomsStore, chatNumUsers,
  chatUsersStore, chatMessagesStore
} from "$lib/stores";
import { PUBLIC_SOCKET_HOST } from '$env/static/public'

const socket = io(PUBLIC_SOCKET_HOST);

socket.on("connect", () => {
  console.debug("Successfully connected to socket");
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

socket.on("updateUsers", ({ room, users }) => {
  const validatedUsers: ChatUser[] = [];

  for (const user of users) {
    const validatedUser = validateChatUser(user);

    if (validatedUser) {
      validatedUsers.push(validatedUser);
      console.log('validuser', user)
    } else {
      console.log('invalid user', user)
    }
  }

  chatUsersStore.set(validatedUsers);
})

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

export function createUser({ acct, group, type, uid }: CreateUserOptions) {
  return new Promise(
    (
      resolve: (value: SendSuccess) => void,
      reject: (value: SendError) => void
    ) => {
      const options = { acct, group, type, uid }
      socket.emit("createUser", options, (response: any) => {
        const error = response.error;

        if (error) {
          console.error('Error in createUser ', error)
          if (typeof error !== "string") {
            reject({ error: "Error sending message" });
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
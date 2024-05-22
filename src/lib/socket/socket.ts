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
  console.log('data in updatechat', data)
  const { acct, message, type } = data
  const validatedMessage: ChatMessage | undefined = validateChatMessage({ content: message, userName: acct, type: type });

  if (validatedMessage) {
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

socket.on("updateUsers", (usernames) => {
  const userNamesArray = Array.isArray(usernames) ? usernames : [usernames]
  const validatedUsers: ChatUser[] = [];
  const limitedUsers = userNamesArray.filter((_, index) => {
    return index < 25;
  });

  const usersToCheck = Object.entries(limitedUsers[0])

  for (const user of usersToCheck) {
    const validatedUser = validateChatUser(user);

    if (validatedUser) {
      validatedUsers.push(validatedUser);
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

export function sendMessage(content: string, id: string) {
  return new Promise(
    (
      resolve: (value: SendSuccess) => void,
      reject: (value: SendError) => void
    ) => {
      socket.emit("sendMessage", content, id, (response: any) => {
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

export function createUser({ acct, group }) {
  return new Promise(
    (
      resolve: (value: SendSuccess) => void,
      reject: (value: SendError) => void
    ) => {
      socket.emit("createUser", { acct, group }, (response: any) => {
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
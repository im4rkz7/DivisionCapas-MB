import { dbDAO } from "../../config/connectToDb.js";
import { denormalizer, normalizer } from "../../utils/normalizr.js";
import { Server } from "socket.io";

export const createIo = (server) => {
  const io = new Server(server);

  io.on("connection", async (client) => {
    const messagesArray = (await dbDAO.getMessages()) || [];

    const normalizedData = normalizer(messagesArray);
    const denormalizedData = denormalizer(normalizedData);

    if (denormalizedData?.messages[0]?._doc) {
      let data = {
        id: "1",
        messages: [],
      };

      denormalizedData.messages.forEach((message) => {
        data.messages.push(message._doc);
      });

      // Send all messages
      client.emit("messages", data);
    } else {
      // Send all messages
      client.emit("messages", denormalizedData);
    }

    // Receive a message.
    client.on("new-message", async (message) => {
      const date = new Date().toLocaleString();

      try {
        // Add message in DataBase.
        await dbDAO.addMessage({ ...message, date });
        messagesArray.messages.push({ ...message, date });
      } catch (e) {
        console.log(e.message);
      }

      // Send the new message.
      io.sockets.emit("message-added", { ...message, date });
    });
  });
};

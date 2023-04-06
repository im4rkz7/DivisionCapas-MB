import mongoose from "mongoose";
import admin from "firebase-admin";
import serviceAccount from "./credentials.json" assert { type: "json" };
import { firebaseConnection, mongoConnection } from "./enviroment.js";
import MessagesMongoDb from "../dataAccess/mongoDA.js";

let isConnected;
let dbDAO;
const db = "mongo";

const connectToFirebase = () => {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: firebaseConnection,
  });
};

const connectToDb = async (db) => {
  if (!isConnected) {
    try {
      switch (db) {
        case "mongo":
          await mongoose.connect(mongoConnection);
          dbDAO = new MessagesMongoDb();
          break;
        case "firebase":
          connectToFirebase();
          dbDAO = new FirebaseDAO();
          break;
        case "archivo":
          dbDAO = new ArchivoDAO();
          break;
      }

      isConnected = true;
      return;
    } catch (e) {
      console.log(e.message);
    }
  }

  return;
};

connectToDb(db);
export { dbDAO };

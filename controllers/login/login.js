import { compareSync } from "bcrypt";
import { usersMongoDb } from "../../dataAccess/mongoDA.js";

const login = async (email, password) => {
  try {
    const users = await usersMongoDb.getUsers();

    const existUser = users.find(
      (user) => user.email === email && compareSync(password, user.password)
    );

    if (!existUser) {
      return {
        success: false,
        error: "Datos inválidos",
      };
    }

    return {
      success: true,
    };
  } catch (e) {
    return {
      success: false,
      error: e.message,
    };
  }
};

export default login;

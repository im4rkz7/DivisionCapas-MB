import { hashSync } from "bcrypt";
import { usersMongoDb } from "../../dataAccess/mongoDA.js";

const signup = async (email, password) => {
  try {
    const users = await usersMongoDb.getUsers();

    const existUser = users.find((user) => user.email === email);

    if (existUser) {
      return {
        success: false,
        error: "El usuario ya existe",
      };
    }

    await usersMongoDb.addUser({ email, password: hashSync(password, 10) });

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

export default signup;

import jwt from "jsonwebtoken";
import { hash, compare } from "bcrypt";

import { TOKEN_SECRET } from "../config/config.js";

export const authService = {
  generateToken: (user) => {
    const payload = {
      userId: user._id,
      username: user.username,
    };
    return jwt.sign(payload, TOKEN_SECRET);
  },

  hashPassword: async (password) => {
    const salt = 10;
    const hashedPassword = await hash(password, salt);
    return hashedPassword;
  },

  comparePassword: async (password, hashedPassword) => {
    const match = await compare(password, hashedPassword);
    return match;
  },
};

export default authService;

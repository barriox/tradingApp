import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config/config.js";

export const verifyToken = function (req, res, next) {
  const { token } = req.cookies;
  if (!token) {
    return res.redirect("/");
  }

  jwt.verify(token, TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.redirect("/");
    }

    req.username = user.username;
    req.userId = user.userId;
    next();
  });
};

export default verifyToken;

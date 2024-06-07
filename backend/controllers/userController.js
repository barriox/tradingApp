import { authService } from "../middlewares/userMiddleware.js";
import { validateRegister, validateLogin } from "../schemas/userSchema.js";
import WalletController from "./walletController.js";
const { hashPassword, generateToken, comparePassword } = authService;

export class UserController {
  constructor({ userModel, WalletModel }) {
    this.userModel = userModel;
    this.walletController = new WalletController({ WalletModel });
  }
  register = async (req, res) => {
    try {
      const result = validateRegister(req.body);
      if (!result.success) {
        return res
          .status(400)
          .json({ error: JSON.parse(result.error.message) });
      }
      const { username, email, password } = req.body;
      const usernameFound = await this.userModel.findOne({ username });
      if (usernameFound) {
        return res.status(400).json({ message: "El usuario ya existe" });
      }
      const securePass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
      if (!securePass.test(password)) {
        return res.status(400).json({
          message:
            "La contraseña debe tener al menos 8 caracteres, mayúsculas, minúsculas y números",
        });
      }
      const hashedPassword = await hashPassword(password);

      const newUser = this.userModel({
        username,
        email,
        password: hashedPassword,
      });
      await newUser.save();

      const user = await this.userModel.findOne({ email });
      await this.walletController.createWallet(user._id);

      res.status(201).json({
        message:
          "El registro se ha completado, sera redirigido para iniciar sesión en:",
      });
    } catch (error) {
      console.log(error.code);
      if (error.code === 11000) {
        res.status(409).json({ message: "El email ya existe" });
      } else {
        console.error(error);
        res.status(500).json({ error: error.message });
      }
    }
  };

  login = async (req, res) => {
    try {
      const result = validateLogin(req.body);
      if (!result.success) {
        return res
          .status(400)
          .json({ error: JSON.parse(result.error.message) });
      }
      const { email, password } = req.body;
      const user = await this.userModel.findOne({ email });

      if (!user) {
        return res
          .status(401)
          .json({ error: "El email o la contraseña no son correctos" });
      }

      const isMatch = await comparePassword(password, user.password);
      if (!isMatch) {
        return res
          .status(401)
          .json({ error: "El email o la contraseña no son correctos" });
      }

      const token = generateToken(user);
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      res.status(200).json({ id: user._id, username: user.username });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  logout = async (req, res) => {
    res.cookie("token", "", {
      httpOnly: true,
      secure: true,
      expires: new Date(0),
    });
    return res.sendStatus(200);
  };
}

export default UserController;

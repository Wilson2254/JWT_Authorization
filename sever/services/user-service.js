import UserModel from "../models/user-model.js";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import MailService from "./mail-service.js";
import TokenService from "./token-service.js";
import UserDto from "../dtos/user-dto.js";

class UserService {
  async registration(email, password) {
    const isUserExist = await UserModel.findOne({ email });
    if (isUserExist) {
      throw new Error(`Пользователь с адресом ${email} уже существует.`);
    }
    const hashPassword = await bcrypt.hash(password, 5);
    const activationLink = nanoid();

    const user = await UserModel.create({
      email: email,
      password: hashPassword,
      activationLink,
    });
    await MailService.sendActivationMail(email, activationLink);

    const userDto = new UserDto(user);
    const tokens = TokenService.generateTokens({ ...userDto });
    await TokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
    };
  }
}

export default new UserService();

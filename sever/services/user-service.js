import UserModel from "../models/user-model.js";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import MailService from "./mail-service.js";
import TokenService from "./token-service.js";
import UserDto from "../dtos/user-dto.js";
import ApiError from "../exceptions/api-error.js";

class UserService {
  async registration(email, password) {
    const isUserExist = await UserModel.findOne({ email });
    if (isUserExist) {
      throw ApiError.badRequest(
        `Пользователь с адресом ${email} уже существует`
      );
    }
    const hashPassword = await bcrypt.hash(password, 5);
    const activationLink = nanoid();

    const user = await UserModel.create({
      email: email,
      password: hashPassword,
      activationLink,
    });
    await MailService.sendActivationMail(
      email,
      `${process.env.APP_URL}/api/activate/${activationLink}`
    );

    return await this.setUserAndTokens(user);
  }

  async activateLink(activationLink) {
    const userByLink = await UserModel.findOne({ activationLink });
    if (!userByLink) {
      throw ApiError.badRequest(`Некорректная ссылка активации`);
    }
    userByLink.isActivated = true;
    await userByLink.save();
  }

  async login(email, password) {
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw ApiError.badRequest(`Пользователь ${email} не был найден`);
    }
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      throw ApiError.badRequest(`Некорректный пароль`);
    }

    return await this.setUserAndTokens(user);
  }

  async setUserAndTokens(user) {
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

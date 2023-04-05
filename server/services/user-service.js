import UserModel from "../models/user-model.js";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import MailService from "./mail-service.js";
import TokenService from "./token-service.js";
import UserDto from "../dtos/user-dto.js";
import ApiError from "../exceptions/api-error.js";
import tokenService from "./token-service.js";
import userModel from "../models/user-model.js";

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
    const linkForCheckMail = await MailService.sendActivationMail(
      email,
      `${process.env.APP_URL}/api/activate/${activationLink}`
    );

    return await this.setUserAndTokens(user, linkForCheckMail);
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

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async setUserAndTokens(user, emailLink = null) {
    const userDto = new UserDto(user);
    const tokens = TokenService.generateTokens({ ...userDto });
    await TokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
      emailLink,
    };
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.unauthorizedError();
    }
    const { userData } = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      throw ApiError.unauthorizedError();
    }
    const user = await userModel.findById(userData.id);
    return await this.setUserAndTokens(user);
  }

  async getAllUsers() {
    const users = await userModel.find();
    return users;
  }
}

export default new UserService();

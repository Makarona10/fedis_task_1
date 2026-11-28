import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { argon2id, hash, verify } from 'argon2';
import { Model } from 'mongoose';
import { randomBytes } from 'node:crypto';
import { promisify } from 'node:util';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import { Response } from 'express';
import { Payload } from './interfaces/payload.interface';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';

const randomBytesAsync = promisify(randomBytes);

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private readonly SALT_LENGTH = 13;

  async hashPassword(pass: string) {
    const salt = await randomBytesAsync(this.SALT_LENGTH);

    const hashedPassword = await hash(pass, {
      salt,
      secret: Buffer.from(process.env.PASSWORD_SECRET, 'base64'),
      type: argon2id,
    });
    return { hash: hashedPassword };
  }

  async generateTokens(payload: Payload) {
    return {
      access_token: await this.jwtService.signAsync(payload),
      refresh_token: await this.jwtService.signAsync(payload, {
        expiresIn: +process.env.JWT_REFRESH_EXPIRATION,
        secret: process.env.JWT_REFRESH_SECRET,
      }),
    };
  }

  async validateUser(credential: { email: string; password: string }) {
    const user = await this.usersService.findUser(credential.email);
    if (!user || !user.password) return null;

    const hashedPassword = user.password;

    const result = await this.verifyPassword(
      hashedPassword,
      credential.password,
    );

    if (!result) return null;

    return user;
  }

  async verifyPassword(hash: string, password: string) {
    return verify(hash, password, {
      secret: Buffer.from(process.env.PASSWORD_SECRET, 'base64'),
    });
  }

  async register(body: RegisterDto, role: 'ADMIN' | 'CUSTOMER' = 'CUSTOMER') {
    const emailLower = body.email.toLowerCase();

    const existingUser = await this.usersService.findUser(emailLower);
    if (existingUser) {
      throw new BadRequestException('This email is already registered');
    }

    const { hash } = await this.hashPassword(body.password);

    const user = await this.userModel.create({
      ...body,
      password: hash,
      isActive: role === 'ADMIN' ? false : true,
      role,
    });

    return {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }

  async login(user: Payload, res: Response) {
    const payload = { id: user.id, email: user.email, role: user.role };

    const data = await this.generateTokens(payload);

    const hashedRefreshToken = await argon.hash(data.refresh_token, {
      hashLength: 32,
      type: argon2id,
      secret: Buffer.from(process.env.JWT_REFRESH_HASH_SECRET, 'base64'),
    });
    try {
      await this.userModel.updateOne({
        $push: { refreshTokens: hashedRefreshToken },
      });
    } catch (error: any) {
      console.log(error);
      throw new InternalServerErrorException();
    }

    res.cookie('refresh_token', data.refresh_token, {
      httpOnly: true,
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { access_token: data.access_token };
  }

  async decodeToken(token: string): Promise<any> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
      return payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async validateRefreshToken(refreshToken: string) {
    const user = await this.userModel.findOne({ refreshTokens: refreshToken });
    if (!user) return false;
    const storedToken = user.refreshTokens.find((t) => t === refreshToken);

    return argon.verify(storedToken, refreshToken, {
      secret: Buffer.from(process.env.JWT_REFRESH_HASH_SECRET, 'base64'),
    });
  }
}

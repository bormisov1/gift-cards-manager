import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { UserDto } from './dto/auth.dto';
import { User, UserDocument } from './schemas/auth.schema';
import { IUser, IAuthService } from './auth.interface';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: UserDto): Promise<boolean> {
    const user = await this.userModel
      .findOne({ username: dto.username })
      .exec();
    if (user) return false;
    const passHash = await bcrypt.hash(dto.password, await bcrypt.genSalt());
    await this.userModel.create({ username: dto.username, passHash });
    return true;
  }

  async validateUser(
    username: string,
    plainPassword: string,
  ): Promise<boolean> {
    const user = await this.userModel.findOne({ username }).exec();
    if (!user) return false;
    const passwordFits = await bcrypt.compare(plainPassword, user.passHash);
    return user && passwordFits;
  }

  signToken(user: IUser): string {
    const payload = { username: user.username };
    return this.jwtService.sign(payload);
  }
}

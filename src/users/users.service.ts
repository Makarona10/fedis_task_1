import { Injectable } from '@nestjs/common';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>
    ) { }

    async findUser(email: string): Promise<UserDocument> {
        return this.userModel.findOne({ email: email.toLowerCase() }, { email: 1, password: 1, role: 1, isActive: 1 }).exec();
    }

    async isUserActive (id: string): Promise<boolean> {
        if (!id) return false
        const user = await this.userModel.findById(id)
        if (!user || !user.isActive)
            return false
        return true
    }
}

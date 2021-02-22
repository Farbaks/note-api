import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Not, Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { NewUserDto } from './dto/new-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ExistingUserDto } from './dto/existing-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';


@Injectable()
export class UserService {
    saltOrRounds: number = 10;
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private jwtService: JwtService
    ) { }

    async generateToken(user) {
        const payload = { email: user.email, sub: user.id };
        return this.jwtService.sign(payload);
    }

    async signUp(user: NewUserDto) {

        // check if email already exists
        let checkEmail = await this.usersRepository.find({ where: { email: user.email } });
        if (checkEmail.length != 0) {
            throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
        }

        // Check if phoneNumber already exists
        let checkNumber = await this.usersRepository.find({ where: { phoneNumber: user.phoneNumber } });
        if (checkNumber.length != 0) {
            throw new HttpException('Phone Number already exists', HttpStatus.BAD_REQUEST);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(user.password, this.saltOrRounds);

        // Save new user to database
        const newUser = new User();
        newUser.firstName = user.firstName;
        newUser.lastName = user.lastName;
        newUser.age = user.age;
        newUser.gender = user.gender;
        newUser.email = user.email;
        newUser.phoneNumber = user.phoneNumber;
        newUser.password = hashedPassword;

        await this.usersRepository.save(newUser);

        // Generate api token
        let apiToken = await this.generateToken(newUser);

        let userAccount = await this.usersRepository.findOne(newUser.id, {
            select: ['id', 'firstName', 'lastName', 'age', 'gender', 'phoneNumber', 'email', 'created_at']
        });
        return {
            statusCode: 201,
            message: "User has been created successfully",
            data: {
                apiToken: apiToken,
                user: userAccount
            }
        };

    }

    async signIn(user: ExistingUserDto) {

        // check if account exists
        let checkAccount = await this.usersRepository.find({
            where: { email: user.email }
        });
        if (checkAccount.length == 0) {
            throw new HttpException('Account does not exist', HttpStatus.BAD_REQUEST);
        }

        // Check if the password is a match
        const isMatch = await bcrypt.compare(user.password, checkAccount[0].password);
        if (!isMatch) {
            throw new HttpException('Password is incorrect', HttpStatus.UNAUTHORIZED);
        }

        // Generate api token
        let userAccount = await this.usersRepository.findOne({
            where: { email: user.email },
            select: ['id', 'firstName', 'lastName', 'age', 'gender', 'phoneNumber', 'email', 'created_at']
        });
        let apiToken = await this.generateToken(userAccount);

        return {
            statusCode: 201,
            message: "User logged in successfully",
            data: {
                apiToken: apiToken,
                user: userAccount
            }
        };

    }

    async getAllUsers() {
        let [users, count] = await this.usersRepository.findAndCount({
            select: ['id', 'firstName', 'lastName', 'age', 'gender', 'phoneNumber', 'email', 'created_at']
        });
        return {
            statusCode: 200,
            message: "Users have been fetched successfully",
            data: {
                numOfUsers: count,
                users: users
            }
        };
    }

    async getOneUser(id: number) {
        let userAccount = await this.usersRepository.findOne(id, {
            select: ['id', 'firstName', 'lastName', 'age', 'gender', 'phoneNumber', 'email', 'created_at']
        });
        if (!userAccount) {
            throw new HttpException('User does not exist', HttpStatus.BAD_REQUEST);
        }
        return {
            statusCode: 200,
            message: "User has been fetched successfully",
            data: {
                user: userAccount
            }
        };
    }

    async updateUser(user: UpdateUserDto, id: number, userId: number) {

        // Check if user is authorized to update account
        if (userId != id) {
            throw new HttpException('User cannot update another user\'s account', HttpStatus.BAD_REQUEST);
        }

        // check if account exists
        let checkAccount = await this.usersRepository.findOne(id);
        if (!checkAccount) {
            throw new HttpException('Account does not exist', HttpStatus.BAD_REQUEST);
        }

        // Check if email already exists
        let checkEmail = await this.usersRepository.find({
            id: Not(id),
            email: Equal(user.email)
        });
        if (checkEmail.length != 0) {
            throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
        }

        // Check if phoneNumber already exists
        let checkNumber = await this.usersRepository.find({
            id: Not(id),
            phoneNumber: Equal(user.phoneNumber)
        });
        if (checkNumber.length != 0) {
            throw new HttpException('Phone Number already exists', HttpStatus.BAD_REQUEST);
        }

        // Update user in database
        const existingUser = await this.usersRepository.findOne(id, {
            select: ['id', 'firstName', 'lastName', 'age', 'gender', 'phoneNumber', 'email', 'created_at']
        });
        existingUser.firstName = user.firstName;
        existingUser.lastName = user.lastName;
        existingUser.age = user.age;
        existingUser.gender = user.gender;
        existingUser.email = user.email;
        existingUser.phoneNumber = user.phoneNumber;

        await this.usersRepository.save(existingUser);

        return {
            statusCode: 201,
            message: "User has been updated successfully",
            data: {
                user: existingUser
            }
        };
    }

    async updatePassword(user: UpdatePasswordDto, id: number, userId: number) {

        // check if account exists
        let checkAccount = await this.usersRepository.findOne(id);
        if (!checkAccount) {
            throw new HttpException('Account does not exist', HttpStatus.BAD_REQUEST);
        }

        // Check if user is updating the right account
        if (userId != id) {
            throw new HttpException('User cannot update another user\'s account', HttpStatus.BAD_REQUEST);
        }

        // Check if the password is a match
        const isMatch = await bcrypt.compare(user.oldPassword, checkAccount.password);
        if (!isMatch) {
            throw new HttpException('oldPassword is incorrect', HttpStatus.UNAUTHORIZED);
        }

        // Update user in database
        // Hash password
        const hashedPassword = await bcrypt.hash(user.newPassword, this.saltOrRounds);
        checkAccount.password = hashedPassword;
        await this.usersRepository.save(checkAccount);

        const existingUser = await this.usersRepository.findOne(id, {
            select: ['id', 'firstName', 'lastName', 'age', 'gender', 'phoneNumber', 'email', 'created_at']
        });
        

        return {
            statusCode: 201,
            message: "User's password has been updated successfully",
            data: {
                user: existingUser
            }
        };
    }


}   

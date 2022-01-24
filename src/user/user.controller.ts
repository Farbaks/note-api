import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Req } from '@nestjs/common';
import { PublicRoute } from 'src/auth/public.decorator';
import { ExistingUserDto } from './dto/existing-user.dto';
import { NewUserDto } from './dto/new-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) { }

    // Route to create a new user
    @PublicRoute()
    @Post('new')
    signup(@Body() newUser: NewUserDto) {
        return this.userService.signUp(newUser);
    }

    // Route to sign in
    @PublicRoute()
    @Post('')
    async Signin(@Body() user: ExistingUserDto) {
        return this.userService.signIn(user);
    }

    // Route to get all users
    @Get()
    async getAllUsers() {
        return this.userService.getAllUsers();
    }

    // Route to get one user
    @Get('one/:id')
    async getOneUser(@Param('id', ParseIntPipe) id: number) {
        return this.userService.getOneUser(id);
    }

    // Route to update a user details
    @Put(':id')
    async updateUser(@Req() req, @Body() user: UpdateUserDto, @Param('id', ParseIntPipe) id: number) {
        return this.userService.updateUser(user, id, req.user.userId);
    }

    // Route to change password
    @Put(':id/password')
    async updatePassword(@Req() req, @Body() user: UpdatePasswordDto, @Param('id', ParseIntPipe) id: number) {
        return this.userService.updatePassword(user, id, req.user.userId);
    }
}

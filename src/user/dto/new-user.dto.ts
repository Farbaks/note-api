import { IsInt, IsEmail, IsNotEmpty } from 'class-validator';

export class NewUserDto {
    @IsNotEmpty()
    firstName:string;

    @IsNotEmpty()
    lastName:string;

    @IsNotEmpty()
    gender:string;

    @IsNotEmpty()
    @IsInt()
    age:number;

    @IsNotEmpty()
    phoneNumber:string;

    @IsNotEmpty()
    @IsEmail()
    email:string;

    @IsNotEmpty()
    password:string;
}

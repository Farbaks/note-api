import { IsNotEmpty, IsInt, IsEmail } from "class-validator";

export class UpdateUserDto {
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
}

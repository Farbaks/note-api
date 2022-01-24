import { IsInt, IsNotEmpty } from "class-validator";

export class FoldersDto {
    @IsNotEmpty()
    name:string;
}

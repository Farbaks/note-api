import { IsInt, IsNotEmpty } from "class-validator";

export class NotesDto {
    @IsNotEmpty()
    title:string;

    @IsNotEmpty()
    content:string;

    @IsNotEmpty()
    @IsInt()
    folderId:number;
}

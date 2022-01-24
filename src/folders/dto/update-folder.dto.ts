import { IsInt, IsNotEmpty } from "class-validator";

export class UpdateFolderDto {
    
    @IsNotEmpty()
    name:string;
}

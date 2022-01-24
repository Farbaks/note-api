import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { Not, Repository } from 'typeorm';
import { FoldersDto } from './dto/folders.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { Folders } from './entity/folders.entity';

@Injectable()
export class FoldersService {

    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(Folders)
        private foldersRepository: Repository<Folders>,
    ) { }

    async getAllFolders(userId:number) {
        return this.foldersRepository.findOne({
            where: { user: userId }
        });
    }

    async createNewFolder(folder: FoldersDto, userId:number) {

        const user = await this.usersRepository.findOne(userId);
        // Check if folder already exists
        let checkFolder = await this.foldersRepository.findOne({
            where: { name: folder.name, user: user }
        });

        if(checkFolder) {
            throw new HttpException('Folder name is already taken', HttpStatus.BAD_REQUEST);
        }

        // Create folder
        const newFolder = new Folders();
        newFolder.name = folder.name;
        newFolder.user = user;
        await this.foldersRepository.save(newFolder);

        const xfolder = await this.foldersRepository.findOne(newFolder.id, {
            select: ['id', 'name', 'created_at', 'updated_at']
        });

        return {
            statusCode: 201,
            message: "Folder has been created successfully",
            data: {
                folder: xfolder
            }
        };
    }

    async updateFolder(folder:UpdateFolderDto, userId:number, folderId:number) {

        const user = await this.usersRepository.findOne(userId);
        // Check if folder exists
        const checkFolder = await this.foldersRepository.findOne(folderId, {
            where: { user:user }
        });

        // If folder does not exist
        if(!checkFolder) {
            throw new HttpException('Folder does not exist', HttpStatus.BAD_REQUEST);
        }

        // Check if folder title is available
        const checkNoteTitle = await this.foldersRepository.findOne({
            where: { id:Not(folderId), title: folder.name, user: user }
        })
        // If folder title is taken
        if (checkNoteTitle) {
            throw new HttpException('Folder name is already taken', HttpStatus.BAD_REQUEST);
        }

        // Update folder
        checkFolder.name = folder.name;
        this.foldersRepository.save(checkFolder);

        return {
            statusCode: 201,
            message: "Folder has been updated successfully",
            data: {
                folder: checkFolder
            }
        };

    }

    async deleteFolder(userId:number, folderId:number) {

        const user = await this.usersRepository.findOne(userId);
        // Check if folder exists
        const checkFolder = await this.foldersRepository.findOne(folderId, {
            where: { user:user }
        });

        // If folder does not exist
        if(!checkFolder) {
            throw new HttpException('Folder does not exist', HttpStatus.BAD_REQUEST);
        }

        await this.foldersRepository.remove(checkFolder);

        return {
            statusCode: 201,
            message: "Folder has been deleted successfully",
            data: {}
        };
    }
}

import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req } from '@nestjs/common';
import { FoldersDto } from './dto/folders.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { FoldersService } from './folders.service';

@Controller('folders')
export class FoldersController {
    constructor(private folderService: FoldersService) { }

    @Get()
    async getAllFolders(@Req() req) {
        return this.folderService.getAllFolders(req.user.userId);
    }

    @Post()
    async createNewFolder(@Req() req, @Body() folder: FoldersDto) {
        return this.folderService.createNewFolder(folder, req.user.userId);
    }

    @Put(':folderId')
    async updateFolder(@Req() req, @Body() folder: UpdateFolderDto, @Param('folderId', ParseIntPipe) folderId: number) {
        return this.folderService.updateFolder(folder, req.user.userId, folderId);
    }

    @Delete(':folderId')
    async deleteFolder(@Req() req, @Param('folderId', ParseIntPipe) folderId: number) {
        return this.folderService.deleteFolder(req.user.userId, folderId);
    }
}

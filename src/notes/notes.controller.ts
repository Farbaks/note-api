import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req } from '@nestjs/common';
import { NotesDto } from './dto/notes.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { NotesService } from './notes.service';

@Controller('notes')
export class NotesController {

    constructor(private notesService:NotesService) {}

    @Get()
    async getAllNotes(@Req() req) {
        return this.notesService.getAllNotes(req.user.userId);
    }

    @Get('folder/:folderId')
    async getNotesByFolder(@Param('folderId', ParseIntPipe) folderId:number, @Req() req) {
        return this.notesService.getNotesByFolder(folderId, req.user.userId);
    }

    @Post()
    async createNewNote(@Body() note:NotesDto, @Req() req) {
        return this.notesService.createNewNote(note, req.user.userId);
    }

    @Put(':noteId')
    async updateNote(@Param('noteId', ParseIntPipe) noteId:number, @Body() note:UpdateNoteDto, @Req() req) {
        return this.notesService.updateNote(noteId, note, req.user.userId);
    }
    
    @Delete(':noteId')
    async deleteNote(@Param('noteId', ParseIntPipe) noteId:number, @Req() req) {
        return this.notesService.deleteNote(noteId, req.user.userId);
    }
}

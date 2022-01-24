import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Folders } from 'src/folders/entity/folders.entity';
import { User } from 'src/user/entity/user.entity';
import { Not, Repository } from 'typeorm';
import { NotesDto } from './dto/notes.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Notes } from './entity/notes.entity';

@Injectable()
export class NotesService {

    constructor(
        @InjectRepository(Notes)
        private notesRepository: Repository<Notes>,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(Folders)
        private foldersRepository: Repository<Folders>,
    ) { }

    async getAllNotes(userId) {
        const user = await this.usersRepository.findOne(userId);

        const notes = await this.notesRepository.find({
            where: { user: user }
        });

        return {
            statusCode: 200,
            message: "Notes have been fetched successfully",
            data: {
                notes: notes
            }
        };
    }

    async getNotesByFolder(folderId, userId) {
        const user = await this.usersRepository.findOne(userId);
        // Check if folder exists
        const checkFolder = await this.foldersRepository.findOne(folderId, {
            where: { user: user }
        });

        // If folder does not exist
        if (!checkFolder) {
            throw new HttpException('Folder does not exist', HttpStatus.BAD_REQUEST);
        }

        const notes = await this.notesRepository.find({
            where: { folder: checkFolder }
        });

        return {
            statusCode: 200,
            message: "Notes have been fetched successfully for this folder",
            data: {
                notes: notes
            }
        };
    }

    async createNewNote(note: NotesDto, userId: number) {
        const user = await this.usersRepository.findOne(userId);
        // Check if folder exists
        const checkFolder = await this.foldersRepository.findOne(note.folderId, {
            where: { user: user }
        });

        // If folder does not exist
        if (!checkFolder) {
            throw new HttpException('Folder does not exist', HttpStatus.BAD_REQUEST);
        }
        // Check if note title is available
        const checkNote = await this.notesRepository.findOne({
            where: { title: note.title, user: user }
        })
        // If folder does not exist
        if (checkNote) {
            throw new HttpException('Note title is already taken', HttpStatus.BAD_REQUEST);
        }

        const newNote = new Notes();
        newNote.title = note.title;
        newNote.content = note.content;
        newNote.user = user;
        newNote.folder = checkFolder;
        await this.notesRepository.save(newNote);

        const xnote = await this.notesRepository.findOne(newNote.id, {
            select: ['id', 'title', 'content', 'created_at', 'updated_at']
        });

        return {
            statusCode: 201,
            message: "Note has been created successfully",
            data: {
                note: xnote
            }
        };
    }

    async updateNote(noteId:number, note:UpdateNoteDto, userId) {
        const user = await this.usersRepository.findOne(userId);
        // Check if note exists
        const checkNote = await this.notesRepository.findOne(noteId, {
            where: { user: user }
        });

        // If note does not exist
        if (!checkNote) {
            throw new HttpException('Note does not exist', HttpStatus.BAD_REQUEST);
        }

        // Check if note title is available
        const checkNoteTitle = await this.notesRepository.findOne({
            where: { id:Not(noteId), title: note.title, user: user }
        })
        // If not title is taken
        if (checkNoteTitle) {
            throw new HttpException('Note title is already taken', HttpStatus.BAD_REQUEST);
        }

        checkNote.title = note.title;
        checkNote.content = note.content;
        await this.notesRepository.save(checkNote);

        return {
            statusCode: 201,
            message: "Note has been updated successfully",
            data: {
                note: checkNote
            }
        };
    }

    async deleteNote(noteId:number, userId:number) {
        const user = await this.usersRepository.findOne(userId);
        // Check if note exists
        const checkNote = await this.notesRepository.findOne(noteId, {
            where: { user:user }
        });

        // If note does not exist
        if(!checkNote) {
            throw new HttpException('Note does not exist', HttpStatus.BAD_REQUEST);
        }

        await this.notesRepository.remove(checkNote);

        return {
            statusCode: 201,
            message: "Note has been deleted successfully",
            data: {}
        };
    }
}

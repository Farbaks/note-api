import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { Folders } from '../folders/entity/folders.entity';
import { User } from '../user/entity/user.entity';
import { Notes } from './entity/notes.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Folders, Notes])
  ],
  providers: [NotesService],
  controllers: [NotesController]
})
export class NotesModule { }

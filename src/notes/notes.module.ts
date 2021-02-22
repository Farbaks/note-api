import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { Notes } from './entity/notes.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notes])
  ],
  providers: [NotesService],
  controllers: [NotesController]
})
export class NotesModule {}

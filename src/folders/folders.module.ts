import { Module } from '@nestjs/common';
import { FoldersController } from './folders.controller';
import { FoldersService } from './folders.service';
import { Folders } from './entity/folders.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Folders])
  ],
  controllers: [FoldersController],
  providers: [FoldersService]
})
export class FoldersModule { }

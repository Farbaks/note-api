import { Module } from '@nestjs/common';
import { FoldersController } from './folders.controller';
import { FoldersService } from './folders.service';
import { Folders } from './entity/folders.entity';
import { User } from '../user/entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Folders, User])
  ],
  controllers: [FoldersController],
  providers: [FoldersService]
})
export class FoldersModule { }

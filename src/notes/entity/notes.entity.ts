import { Folders } from 'src/folders/entity/folders.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../user/entity/user.entity';


@Entity()
export class Notes {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title:string;

    @Column('text')
    content:string;

    @ManyToOne(type => Folders, folder => folder.notes, {
        onDelete: 'CASCADE'
    })
    folder:Folders;

    @ManyToOne( type => User, user => user.notes, {
        onDelete: 'CASCADE'
    })
    user:User;

    @CreateDateColumn()
    created_at:any;

    @UpdateDateColumn()
    updated_at:any;
}

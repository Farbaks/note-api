import { Notes } from 'src/notes/entity/notes.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../user/entity/user.entity';

@Entity()
export class Folders {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name:string;

    @ManyToOne( type => User, user => user.folders, {
        onDelete: 'CASCADE'
    })
    user:User;

    @OneToMany(type => Notes, note => note.folder)
    notes:Notes[];

    @CreateDateColumn()
    created_at:any;

    @UpdateDateColumn()
    updated_at:any;

}

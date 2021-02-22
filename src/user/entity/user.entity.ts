import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Notes } from '../../notes/entity/notes.entity';
import { Folders } from '../../folders/entity/folders.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName:string;

    @Column()
    lastName:string;

    @Column()
    gender:string;

    @Column()
    age:number;

    @Column({
        unique:true
    })
    phoneNumber:string;

    @Column({
        unique:true
    })
    email:string;

    @Column()
    password:string;

    @OneToMany(type => Notes, note => note.user)
    notes:Notes[];

    @OneToMany(type => Folders, folder => folder.user)
    folders:Folders[];

    @CreateDateColumn()
    created_at:any;

    @UpdateDateColumn()
    updated_at:any;
    

}
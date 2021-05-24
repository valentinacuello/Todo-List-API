import {
    Entity, Column, PrimaryGeneratedColumn, OneToMany,
    BaseEntity, JoinTable
} from 'typeorm';
import { Todos } from "./Todos";

@Entity()
export class Users extends BaseEntity {
    @PrimaryGeneratedColumn()
    userId: number;

    @Column()
    first_name: string;

    @Column()
    last_name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @OneToMany(() => Todos, todos => todos.user, {onDelete: 'CASCADE'})
    todos: Todos[];
}
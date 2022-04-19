import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Bot {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    purpose: string;

}

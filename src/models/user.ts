import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({name:'users'})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable:true})
  name: string;

  @Column({ unique: true, nullable:true})
  email: string;
}

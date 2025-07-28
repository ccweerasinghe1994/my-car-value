import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @AfterInsert()
  logInsertWithId() {
    console.log(`User created with ID: ${this.id} and email: ${this.email}`);
  }

  @AfterUpdate()
  logUpdateWithId() {
    console.log(`User updated with ID: ${this.id} and email: ${this.email}`);
  }

  @AfterRemove()
  logRemoveWithId() {
    console.log(`User removed with ID: ${this.id} and email: ${this.email}`);
  }
}

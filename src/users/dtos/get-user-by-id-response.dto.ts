import { User } from '../users.entity';

export class GetUserByIdResponseDto {
  id: number;
  email: string;

  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
  }
}

import { DataSource } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export async function seedUsers(dataSource: DataSource): Promise<User[]> {
  const userRepository = dataSource.getRepository(User);

  const users = [
    {
      email: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'hashedPassword123', // In real app, this should be hashed
      isEmailVerified: true,
      phoneNumber: '+1234567890',
      dateOfBirth: new Date('1990-01-15'),
    },
    {
      email: 'jane.smith@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
      password: 'hashedPassword456',
      isEmailVerified: true,
      phoneNumber: '+1987654321',
      dateOfBirth: new Date('1988-05-20'),
    },
    {
      email: 'mike.johnson@example.com',
      firstName: 'Mike',
      lastName: 'Johnson',
      password: 'hashedPassword789',
      isEmailVerified: false,
      phoneNumber: '+1122334455',
      dateOfBirth: new Date('1992-11-30'),
    },
  ];

  const createdUsers = [];
  for (const userData of users) {
    const existingUser = await userRepository.findOne({
      where: { email: userData.email },
    });

    if (!existingUser) {
      const user = userRepository.create(userData);
      const savedUser = await userRepository.save(user);
      createdUsers.push(savedUser);
      console.log(`Created user: ${savedUser.email}`);
    } else {
      createdUsers.push(existingUser);
      console.log(`User already exists: ${existingUser.email}`);
    }
  }

  return createdUsers;
}

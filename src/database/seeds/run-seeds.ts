import { AppDataSource } from '../data-source';
import { seedReports } from './report.seed';
import { seedUsers } from './user.seed';

async function runSeeds() {
  try {
    console.log('Initializing database connection...');
    await AppDataSource.initialize();

    console.log('Starting database seeding...');

    console.log('Seeding users...');
    const users = await seedUsers(AppDataSource);

    console.log('Seeding reports...');
    const reports = await seedReports(AppDataSource, users);

    console.log(`Database seeding completed successfully!`);
    console.log(`Created ${users.length} users and ${reports.length} reports.`);
  } catch (error) {
    console.error('Error during database seeding:', error);
    process.exit(1);
  } finally {
    await AppDataSource.destroy();
    console.log('Database connection closed.');
  }
}

runSeeds();

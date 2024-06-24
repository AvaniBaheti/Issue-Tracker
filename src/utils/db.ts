import { DataSource } from 'typeorm';
import { Issue } from '@/models/issue';
import { User } from '@/models/user';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host:process.env.host,
  port: 6543,
  username: process.env.username,
  password: process.env.password,
  database: 'postgres',
  synchronize: true, 
  logging: true, 
  entities: [Issue, User],
  migrations: [],
  subscribers: [],
});

export const connectDatabase = async () => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log('Database connected');
    }
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
};
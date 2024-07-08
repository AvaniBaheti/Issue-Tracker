import { DataSource } from 'typeorm';
import config from './ormconfig';
import { Issue } from '@/models/issue';
import { User } from '@/models/user';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
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
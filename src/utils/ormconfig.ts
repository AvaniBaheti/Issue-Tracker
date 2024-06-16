import { ConnectionOptions } from 'typeorm';
import { Issue } from 'src/models/issue';

const config: ConnectionOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [Issue],
  synchronize: true,
};

export default config;

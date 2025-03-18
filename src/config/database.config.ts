import { DataSourceOptions } from 'typeorm';

import 'dotenv/config';
import { Teacher } from 'src/teacher/teacher.entity';
import { Student } from 'src/student/student.entity';
import { TypeOrmCustomLogger } from './typeormlogger.config';

export const config: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_HOST_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*.js'],
  logging: true,
  logger: new TypeOrmCustomLogger(),
};

// export const AppDataSource = new DataSource(config);

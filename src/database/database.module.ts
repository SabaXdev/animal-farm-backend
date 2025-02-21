import { Global, Module, OnModuleInit } from '@nestjs/common';
import { InjectConnection, MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Connection } from 'mongoose';

@Global()
@Module({
    imports: [
      ConfigModule.forRoot(),
      MongooseModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          uri: configService.get('DB_URI', 'mongodb://localhost:27017/animal_farm'),
        }),
      }),
    ],
  })
export class DatabaseModule implements OnModuleInit {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  async onModuleInit() {
    try {
      console.log(`Connected to database: ${this.connection.name}`);
      console.log(`Database host: ${this.connection.host}`);
    } catch (error) {
      console.error('Database connection failed:', error.message);
    }
  }
}

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
          uri: configService.get('DB_URI', 'mongodb+srv://sabakatamadze:qALEhZ6nVysVMsGl@cluster0.gudjj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'),
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

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AnimalsModule } from './animals/animals.module';
import { PigModule } from './pig/pig.module';
import { MusicModule } from './music/music.module';
import { DatabaseModule } from './database/database.module';
import { AnimalsController } from './animals/animals.controller';
import { PigController } from './pig/pig.controller';
import { MusicController } from './music/music.controller';

@Module({
  imports: [AnimalsModule, PigModule, MusicModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

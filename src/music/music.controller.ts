import { Controller, Post } from '@nestjs/common';
import { MusicService } from './music.service';

@Controller('api/music')
export class MusicController {
  constructor(private readonly musicService: MusicService) {}
        
  // POST /api/music/toggle
  @Post('toggle')
  async toggleMusic() {
    return this.musicService.toggleMusic();
  }
}

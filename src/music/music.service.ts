import { Injectable } from '@nestjs/common';

@Injectable()
export class MusicService {
    private musicState: boolean = false;
    
    async toggleMusic(): Promise<{ isPlaying: boolean; message: string }> {
        this.musicState = !this.musicState;
    
        return {
          isPlaying: this.musicState,
          message: this.musicState ? 'Putin music is playing' : 'Pig music is playing',
      };
    }
}

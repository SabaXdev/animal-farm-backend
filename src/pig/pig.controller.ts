import { Controller, Get } from '@nestjs/common';
import { PigService } from './pig.service';

@Controller('api/pig')
export class PigController {
    constructor(private readonly pigService: PigService) {}

    @Get('status')
    async getPigState(): Promise<{ state: any }> {
        const state = await this.pigService.getPigState();
        return { state };
    }

}

import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    console.log('testing home controller');
    let res = this.appService.getHello();
    return {
      message: 'This is backend home route of Pharmacy POS.',
      data: res,
    };
  }
}

import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('weather')
  getWeather(@Query('city') city: string) {
    return this.appService.getWeatherByCity(city);
  }

  @Get('weather/coordinates')
  getWeatherByCoordinates(
    @Query('lat') lat: number,
    @Query('lon') lon: number,
  ) {
    return this.appService.getWeatherByCoordinates(lat, lon);
  }

  @Get('weather/history')
  getHistory() {
    return this.appService.getLastHundredRequests();
  }
}
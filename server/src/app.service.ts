import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { Weather } from './weather.schema';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Weather.name) private weatherModel: Model<Weather>,
    private httpService: HttpService,
  ) {}

  private readonly API_KEY = process.env.OPENWEATHER_API_KEY;
  private readonly API_BASE = 'https://api.openweathermap.org/data/2.5/weather';

  async getWeatherByCity(city: string) {
    try {
      const url = `${this.API_BASE}?q=${city}&appid=${this.API_KEY}&units=metric`;
      const response = await firstValueFrom(this.httpService.get(url));

      const weather = new this.weatherModel({
        city,
        weatherData: response.data,
      });
      await weather.save();

      return response.data;
    } catch (error) {
      if (error.response) {
        throw new HttpException(
          error.response.data.message,
          error.response.status,
        );
      }
      throw new HttpException(
        'Failed to fetch weather data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getWeatherByCoordinates(lat: number, lon: number) {
    try {
      const geoUrl = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${this.API_KEY}`;
      const geoResponse = await firstValueFrom(this.httpService.get(geoUrl));
      const cityName = geoResponse.data[0]?.name || 'Unknown';

      const weatherUrl = `${this.API_BASE}?lat=${lat}&lon=${lon}&appid=${this.API_KEY}&units=metric`;
      const weatherResponse = await firstValueFrom(
        this.httpService.get(weatherUrl),
      );

      const weather = new this.weatherModel({
        city: cityName,
        weatherData: weatherResponse.data,
      });
      await weather.save();

      return weatherResponse.data;
    } catch (error) {
      if (error.response) {
        throw new HttpException(
          error.response.data.message,
          error.response.status,
        );
      }
      throw new HttpException(
        'Failed to fetch weather data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getLastHundredRequests() {
    return this.weatherModel.find().sort({ createdAt: -1 }).limit(100).exec();
  }
}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Weather, WeatherSchema } from './weather.schema';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    MongooseModule.forFeature([{ name: Weather.name, schema: WeatherSchema }]),
    HttpModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
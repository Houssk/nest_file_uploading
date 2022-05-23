import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService} from './app.service';
import {MulterModule} from '@nestjs/platform-express';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [MulterModule.register({
    dest: './files',
  }), EventEmitterModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

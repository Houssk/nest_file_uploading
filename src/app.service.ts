import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}

@Injectable()
export class EventDemo {
    constructor(private eventEmitter: EventEmitter2){}

    emitEvent() {
        this.eventEmitter.emit('json.created')
        console.log('event emitted')
    }

    @OnEvent('json.created')
    listentToEvent() {
        console.log('event received')
    }
}

import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";

@Injectable()
export class AppService {
    constructor(private eventEmitter: EventEmitter2){}

    emitEvent(file: string) {
        this.eventEmitter.emit('json.created',file)
    }

    @OnEvent('json.created')
    listentToEvent() {
        console.log('event received')
    }
}

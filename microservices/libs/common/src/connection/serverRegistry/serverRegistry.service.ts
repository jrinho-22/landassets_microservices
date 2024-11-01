import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Transport } from "@nestjs/microservices";

@Injectable()
export class ServerRegistryService {
    private _rabitUrl: string

    constructor(private configService: ConfigService) { 
        const RABBITMQ_DEFAULT_USER = configService.get<string>('RABBITMQ_DEFAULT_USER')
        const RABBITMQ_DEFAULT_PASS = configService.get<string>('RABBITMQ_DEFAULT_PASS')
        const RABBITMQ_DEFAULT_VHOST = configService.get<string>('RABBITMQ_DEFAULT_VHOST')
        const RABBITMQ_HOST = configService.get<string>('RABBITMQ_HOST')
        this._rabitUrl = `amqp://${RABBITMQ_DEFAULT_USER}:${RABBITMQ_DEFAULT_PASS}@${RABBITMQ_HOST}:5672/${RABBITMQ_DEFAULT_VHOST}`
    }

    microserviceCon(queue: string){
        return {
            transport: Transport.RMQ,
            options: {
              urls: this._rabitUrl,
              queue: queue,
              queueOptions: {
                durable: false
              },
            }
          }
    }

    get rabitUrl() {
        return this._rabitUrl
    }
}
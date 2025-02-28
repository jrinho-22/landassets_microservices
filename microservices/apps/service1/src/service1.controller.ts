import { Controller, Get } from "@nestjs/common";
import { Public } from '@app/common';

@Controller('')
export class Service1Controller {
  constructor() { }

  @Public()
  @Get("connection")
  testConnection() {
    return {value: "Connected"}
  }
}
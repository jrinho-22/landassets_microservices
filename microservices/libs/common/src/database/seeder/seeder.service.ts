import { Injectable, Logger } from '@nestjs/common';
import * as every from './seederData';
// const httpServiceFactory = (httpClient: HttpClient) =>
//   new HttpRequestService(httpClient, 'estate');

// export const factoryProvider = [
//   {
//     provide: HttpRequestService,
//     useFactory: httpServiceFactory,
//     deps: [HttpClient],
//   },
// ];
@Injectable()
export class Seeder {
  constructor(
    private readonly services: { service: { findAll: () => Promise<any>, createSeed: ([]) => Promise<any>[] }, data: any }[],
  ) { }

  async seed() {
    for (let s of this.services) {
      let created = []
      const res = await Promise.all(s.service.createSeed(s.data).map(async (v) => {
        return v.then(vv => {
          if (vv) {
            created.push(vv)
            return vv
          } else {
            return null
          }
        })
      }))
      console.log('created', res.filter(v => v !== null).length)
      for (let i of await Promise.all(created)) {
        console.log('errinho:', i)
      }
    }
  }
}

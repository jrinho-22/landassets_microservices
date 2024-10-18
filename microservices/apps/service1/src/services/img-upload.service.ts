import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class ImgUploadService {
    static remove(publicId: string): Promise<any> {
        return new Promise((resolve, reject) => {
          cloudinary.uploader.destroy(publicId, (error, result: any) => {
            if (error) return reject(error);
            return resolve(result);
          });
        });
      }

    static upload(buffer: Buffer): Promise<any> {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream((error, uploadResult) => {
                if (error) reject(error)
                return resolve(uploadResult);
            }).end(buffer);
        }).then((uploadResult: any) => {
            return uploadResult
        });
    }
}

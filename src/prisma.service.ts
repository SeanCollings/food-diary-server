import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    // try {
    //   // Note: this is optional
    //   // await this.$connect();
    // } catch (err) {
    //   console.error('[PrismaService: $connect] ::', err.message);
    // }
  }
}

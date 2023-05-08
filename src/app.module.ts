import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { DiaryModule } from '@/diary/diary.module';
import { UsersModule } from '@/users/users.module';
import { AuthModule } from './auth/auth.module';
import { MealsModule } from './meals/meals.module';
import { WellnessModule } from './wellness/wellness.module';
import { TrendsModule } from './trends/trends.module';
import { ShareModule } from './share/share.module';
import { SummaryModule } from './summary/summary.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    DiaryModule,
    AuthModule,
    MealsModule,
    WellnessModule,
    TrendsModule,
    ShareModule,
    SummaryModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}

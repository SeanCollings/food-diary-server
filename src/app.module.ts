import { Module } from '@nestjs/common';
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

@Module({
  imports: [
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
  providers: [AppService],
})
export class AppModule {}

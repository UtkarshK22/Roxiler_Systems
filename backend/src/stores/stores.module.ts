import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoresService } from './stores.service';
import { StoresController } from './stores.controller';
import { Store } from '../common/entities/store.entity';
import { User } from '../common/entities/user.entity';
import { Rating } from 'src/common/entities/rating.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Store, User, Rating])],
  providers: [StoresService],
  controllers: [StoresController],
  exports: [StoresService],
})
export class StoresModule {}




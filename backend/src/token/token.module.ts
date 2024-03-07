import { Module } from '@nestjs/common';
import { TokenSevice } from './token.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [TokenSevice, JwtService],
  exports: [TokenModule],
})
export class TokenModule {}

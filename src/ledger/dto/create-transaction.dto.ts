/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsString,
  IsNotEmpty,
  IsInt,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class JournalEntryDto {
  @ApiProperty({
    example: 'uuid-of-checking-account',
    description: 'The Account ID to debit/credit',
  })
  @IsString()
  @IsNotEmpty()
  accountId: string;

  @ApiProperty({
    example: 10000,
    description: 'Amount in CENTS. Positive for Debit, Negative for Credit',
  })
  @IsInt()
  amount: number;
}

export class CreateTransactionDto {
  @ApiProperty({ example: 'Payment for Office Rent - Jan' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ type: [JournalEntryDto] })
  @ArrayMinSize(2) // Double entry requires at least 2 entries
  @ValidateNested({ each: true })
  @Type(() => JournalEntryDto)
  entries: JournalEntryDto[];
}

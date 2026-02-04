/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Body, Controller, Post, Get } from '@nestjs/common';
import { LedgerService } from './ledger.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Ledger') // Groups endpoints in Swagger
@Controller('ledger')
export class LedgerController {
  constructor(private readonly ledgerService: LedgerService) {}

  @Post('transaction')
  @ApiOperation({ summary: 'Record a Double-Entry Transaction' })
  create(@Body() dto: CreateTransactionDto) {
    return this.ledgerService.createTransaction(dto);
  }

  @Get('accounts')
  @ApiOperation({ summary: 'List all Accounts' })
  async listAccounts() {
    return this.ledgerService.getAllAccounts();
  }
}

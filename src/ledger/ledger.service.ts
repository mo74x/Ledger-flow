/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class LedgerService {
  constructor(private prisma: PrismaService) {}

  async createTransaction(dto: CreateTransactionDto) {
    // 1. Validation: The fundamental rule of Accounting
    // The sum of all debits and credits MUST be ZERO.
    const sum = dto.entries.reduce((acc, entry) => acc + entry.amount, 0);
    if (sum !== 0) {
      throw new BadRequestException(
        `Transaction is not balanced! Difference: ${sum} cents.`,
      );
    }

    // 2. The ACID Transaction
    // We execute these database steps together. If one fails, they all roll back.
    return await this.prisma.$transaction(async (tx) => {
      // Step A: Create the Transaction Record
      const transaction = await tx.transaction.create({
        data: {
          description: dto.description,
          entries: {
            create: dto.entries.map((entry) => ({
              amount: entry.amount,
              account: { connect: { id: entry.accountId } },
            })),
          },
        },
        include: { entries: true },
      });

      // Step B: Update the cached balances for every affected account
      // This is crucial for performance so we don't have to sum entries every time we read a balance
      for (const entry of dto.entries) {
        await tx.account.update({
          where: { id: entry.accountId },
          data: {
            currentBalance: { increment: entry.amount },
          },
        });
      }

      return transaction;
    });
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getAllAccounts() {
    return this.prisma.account.findMany();
  }
}

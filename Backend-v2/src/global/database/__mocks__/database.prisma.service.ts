import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset } from 'jest-mock-extended';

beforeEach(() => {
	mockReset(PrismaService)
})

export const PrismaService = mockDeep<PrismaClient>();

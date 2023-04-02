import { AuthService } from '@src/modules/global/auth/auth.service';
import { AuthGuard as MockAuthGuard } from '@src/modules/global/auth/__mocks__/auth.guard';
import config from '@config';
import { PrismaService } from '@src/modules/global/database/database.prisma.service';
import { PrismaService as MockPrismaService } from "@src/modules/global/database/__mocks__/database.prisma.service";
import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { Comment, Prisma } from '@prisma/client';
import request from "supertest";
import { CommentController } from './comment.controller';

const newestDate = new Date();

type CommentWithRelations = Prisma.CommentGetPayload<{
	include: {
		childs: true,
		interactions: true,
	}
}> & { author: unknown }

const dummyComments: CommentWithRelations[] = [
	{
		id: '1',
		ticketId: 1,
		content: 'First comment on ticket 1',
		authorId: 'user1',
		createdAt: new Date("2018-03-05"),
		updatedAt: null,
		createUser: null,
		updateUser: null,
		parentId: null,
		childs: [],
		interactions: [],
		author: {}
	},
	{
		id: '2',
		ticketId: 1,
		content: 'Second comment on ticket 1',
		authorId: 'user2',
		createdAt: new Date("2020-03-05"),
		updatedAt: null,
		createUser: null,
		updateUser: null,
		parentId: '1',
		childs: [],
		interactions: [],
		author: {}
	},
	{
		id: '3',
		ticketId: 2,
		content: 'First comment on ticket 2',
		authorId: 'user3',
		createdAt: new Date("2020-03-05"),
		updatedAt: null,
		createUser: null,
		updateUser: null,
		parentId: null,
		childs: [],
		interactions: [],
		author: {}
	},
	{
		id: '4',
		ticketId: 2,
		content: 'Second comment on ticket 2',
		authorId: 'user1',
		createdAt: new Date("2021-03-05"),
		updatedAt: null,
		createUser: null,
		updateUser: null,
		parentId: null,
		childs: [],
		interactions: [],
		author: {}
	},
	{
		id: '5',
		ticketId: 2,
		content: 'Third comment on ticket 2',
		authorId: 'user2',
		createdAt: newestDate,
		updatedAt: null,
		createUser: null,
		updateUser: null,
		parentId: '3',
		childs: [],
		interactions: [],
		author: {}
	},
	{
		id: '6',
		ticketId: 3,
		content: 'First comment on ticket 3',
		authorId: 'user1',
		createdAt: new Date("2020-03-05"),
		updatedAt: null,
		createUser: null,
		updateUser: null,
		parentId: null,
		childs: [],
		interactions: [],
		author: {}
	},
	{
		id: '7',
		ticketId: 3,
		content: 'Second comment on ticket 3',
		authorId: 'user3',
		createdAt: new Date("2020-03-05"),
		updatedAt: null,
		createUser: null,
		updateUser: null,
		parentId: '6',
		childs: [],
		interactions: [],
		author: {}
	},
	{
		id: '8',
		ticketId: 4,
		content: 'First comment on ticket 4',
		authorId: 'user2',
		createdAt: new Date("2020-03-05"),
		updatedAt: null,
		createUser: null,
		updateUser: null,
		parentId: null,
		childs: [],
		interactions: [],
		author: {}
	},
	{
		id: '9',
		ticketId: 4,
		content: 'Second comment on ticket 4',
		authorId: 'user1',
		createdAt: new Date("2020-03-05"),
		updatedAt: null,
		createUser: null,
		updateUser: null,
		parentId: '8',
		childs: [],
		interactions: [],
		author: {}
	},
	{
		id: '10',
		ticketId: 4,
		content: 'Third comment on ticket 4',
		authorId: 'user3',
		createdAt: new Date("2019-03-05"),
		updatedAt: null,
		createUser: null,
		updateUser: null,
		parentId: '9',
		childs: [],
		interactions: [],
		author: {}
	},
];

describe('CommentController', () => {

	let controller: CommentController;
	let app: INestApplication
	const prismaServiceMock = MockPrismaService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [ConfigModule.forRoot({
				isGlobal: true,
				load: [config]
			})],
			providers: [
				PrismaService,
				{
					provide: APP_GUARD,
					useClass: MockAuthGuard,
				},
				AuthService
			],
			controllers: [CommentController],
		}).overrideProvider(PrismaService)
			.useValue(prismaServiceMock)
			.compile();

		controller = module.get<CommentController>(CommentController);

		app = module.createNestApplication()
		await app.init();
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	describe("GET /comments", () => {
		it("should sort it based on orderBy params", async () => {

			prismaServiceMock.comment.findMany.mockResolvedValue(dummyComments);

			const response = await request(app.getHttpServer())
				.get("/comments")
				.query({
					orderBy: "newestFirst"
				});

			const comments = response.body as Comment[]
			const firstComment = comments[0];

			const createdAt = new Date(firstComment.createdAt!.toString());

			expect(Date.UTC(createdAt.getFullYear(),
				createdAt.getMonth(),
				createdAt.getDay())
			).toBe(Date.UTC(newestDate.getFullYear(),
				newestDate.getMonth(),
				newestDate.getDay()));
		});
	})

	afterAll(async () => {
		await app.close();
	})
});

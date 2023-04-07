import { AuthGuard as MockAuthGuard } from '@src/modules/global/auth/__mocks__/auth.guard';
import { PrismaService as MockPrismaService } from "@src/modules/global/database/__mocks__/prisma.service";
import { Injectable } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { Test } from "@nestjs/testing";
import config from "@src/config";
import { PrismaService } from "@src/modules/global/database/prisma.service";
import { UserService } from "@src/modules/user/user.service";
import { BaseTicketActivityPrismaMiddlewareProvider, TicketActivityEventColorMap, TicketActivityEventLabelMap, TicketActivityModelIconMap } from "./base-ticket-activity-prisma-middleware.provider";
import { TicketActivityMailProvider } from "./ticket-activity-mail.provider";

const comment = {
	ticketId: 1,
	title: "dummy title",
	description: "dummy description"
}

const commentCreatedActivityDescription = "Comment has been created"
const commentUpdatedActivityDescription = "Comment has been updated"

@Injectable()
class TestTicketActivityPrismaMiddlewareProvider extends BaseTicketActivityPrismaMiddlewareProvider {

	constructor(
		protected readonly prisma: PrismaService,
		protected readonly userService: UserService,
		protected readonly ticketActivityMailProvider: TicketActivityMailProvider
	) {
		super(prisma, userService, ticketActivityMailProvider)
	}

	create = super.create;
}

describe("TicketActivityPrismaMiddlewareProvider", () => {

	let ticketActivityPrismaMiddlewareProvider: TestTicketActivityPrismaMiddlewareProvider
	const prismaMock = MockPrismaService;

	beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
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
				UserService,
				TicketActivityMailProvider,
				TestTicketActivityPrismaMiddlewareProvider
			]
		}).overrideProvider(PrismaService)
			.useValue(prismaMock)
			.overrideProvider(TicketActivityMailProvider)
			.useValue({
				sendEmailToWatchingUsers: jest.fn()
			})
			.compile();

		const userService = moduleRef.get(UserService);
		userService.setCurrentUser({
			id: "12345",
			username: "johndoe",
			password: "secretpassword",
			email: "johndoe@example.com",
			emailConfirmed: true,
			createdAt: new Date("2022-01-01T00:00:00.000Z"),
			updatedAt: new Date("2022-01-01T01:00:00.000Z"),
			createUser: null,
			updateUser: "admin",
		});

		ticketActivityPrismaMiddlewareProvider = moduleRef.get(TestTicketActivityPrismaMiddlewareProvider);
	});

	describe("optional parameters", () => {
		it("allows async evaluators", async () => {

			const CreateTicketActivityBasedOnTestFn = ticketActivityPrismaMiddlewareProvider.create("Comment", ["create", "update"], {
				disableMailDelivery: true,
				descriptionEvaluator: (event) => {
					return new Promise((resolve) => {
						if (event === "create") {
							resolve(commentCreatedActivityDescription)
						}
						if (event === "update") {
							resolve(comment.title)
						}
						else resolve(null);
					})
				}
			});

			const ticketActivityCreateFn = jest.spyOn(prismaMock.ticketActivity, "create")

			await CreateTicketActivityBasedOnTestFn({
				model: "Comment",
				action: "create",
				args: {
					data: comment
				},
				dataPath: [],
				runInTransaction: false
			}, jest.fn());

			await CreateTicketActivityBasedOnTestFn({
				model: "Comment",
				action: "update",
				args: {
					data: comment
				},
				dataPath: [],
				runInTransaction: false
			}, jest.fn());

			expect(ticketActivityCreateFn).toHaveBeenNthCalledWith(1,
				expect.objectContaining({
					data: expect.objectContaining({
						description: commentCreatedActivityDescription
					})
				})
			)

			expect(ticketActivityCreateFn).toHaveBeenNthCalledWith(2,
				expect.objectContaining({
					data: expect.objectContaining({
						description: comment.title
					})
				})
			)

		})
		describe("events", () => {
			it("allows to filter out events", async () => {

				const CreateTicketActivityBasedOnTestFn = ticketActivityPrismaMiddlewareProvider.create("Comment", ["update"], {
					disableMailDelivery: true,
					descriptionEvaluator: async (event) => {
						if (event === "update") return commentUpdatedActivityDescription // should be
						else return commentCreatedActivityDescription // should not be
					}
				});

				const ticketActivityCreateFn = jest.spyOn(prismaMock.ticketActivity, "create")

				await CreateTicketActivityBasedOnTestFn({
					model: "Comment",
					action: "create",
					args: {
						data: comment
					},
					dataPath: [],
					runInTransaction: false
				}, jest.fn());

				await CreateTicketActivityBasedOnTestFn({
					model: "Comment",
					action: "update",
					args: {
						data: comment
					},
					dataPath: [],
					runInTransaction: false
				}, jest.fn());

				expect(ticketActivityCreateFn).toHaveBeenCalledTimes(1);
				expect(ticketActivityCreateFn).toHaveBeenCalledWith(
					expect.objectContaining({
						data: expect.objectContaining({
							description: commentUpdatedActivityDescription
						})
					})
				)

			});
		})
	})

	describe("when creating activity", () => {

		const CreateTicketActivityBasedOnTrigger = () => {
			ticketActivityPrismaMiddlewareProvider.create("Comment", ["create", "update"], { disableMailDelivery: true })({
				model: "Comment",
				action: "create",
				args: {
					data: comment
				},
				dataPath: [],
				runInTransaction: false
			}, jest.fn());
		}

		it("maps color based on event", async () => {

			const ticketActivityCreateFn = jest.spyOn(prismaMock.ticketActivity, "create")

			CreateTicketActivityBasedOnTrigger()

			expect(ticketActivityCreateFn).toHaveBeenCalledWith(
				expect.objectContaining({
					data: expect.objectContaining({
						color: TicketActivityEventColorMap.create
					})
				})
			)

		})

		it("maps icon based on model", () => {

			const ticketActivityCreateFn = jest.spyOn(prismaMock.ticketActivity, "create")

			CreateTicketActivityBasedOnTrigger()

			expect(ticketActivityCreateFn).toHaveBeenCalledWith(
				expect.objectContaining({
					data: expect.objectContaining({
						icon: TicketActivityModelIconMap.Comment
					})
				})
			)
		})

		it("maps title based on event label map", () => {
			const ticketActivityCreateFn = jest.spyOn(prismaMock.ticketActivity, "create")

			CreateTicketActivityBasedOnTrigger()

			expect(ticketActivityCreateFn).toHaveBeenCalledWith(
				expect.objectContaining({
					data: expect.objectContaining({
						title: expect.stringContaining(TicketActivityEventLabelMap.create)
					})
				})
			)
		})
	});

});
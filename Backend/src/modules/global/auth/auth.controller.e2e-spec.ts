import config from "@config";
import { PrismaService } from "@src/modules/global/database/prisma.service";
import { PrismaService as MockPrismaService } from "@src/modules/global/database/__mocks__/prisma.service";
import { MailTemplateProvider } from "@src/modules/mail/mail-template.provider";
import { INestApplication } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { Test } from "@nestjs/testing";
import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import request from "supertest";
import { AuthController } from "./auth.controller";
import { AuthMailDeliveryService } from "./auth-mail-delivery.service";
import { UserSignInDto, UserSignUpDto } from "./user.dtos";
import { LogService } from "@src/modules/log/log.service";
import { LogService as MockLogService } from "@src/modules/log/__mocks__/log.service";

const dummyUser: User = {
	id: "12345",
	username: "johndoe",
	password: "secretpassword",
	email: "johndoe@example.com",
	emailConfirmed: true,
	createdAt: new Date("2022-01-01T00:00:00.000Z"),
	updatedAt: new Date("2022-01-01T01:00:00.000Z"),
	createUser: null,
	updateUser: "admin",
	roleId: null,
};

describe("AuthController", () => {
	let app: INestApplication;
	const prismaServiceMock = MockPrismaService;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({
					isGlobal: true,
					load: [config],
				}),
			],
			providers: [PrismaService, AuthMailDeliveryService, MailTemplateProvider, LogService],
			controllers: [AuthController],
		})
			.overrideProvider(PrismaService)
			.useValue(prismaServiceMock)
			.overrideProvider(AuthMailDeliveryService)
			.useValue({
				sendEmailConfirmationEmail: jest.fn(),
			})
			.overrideProvider(LogService)
			.useValue(MockLogService)
			.compile();

		app = moduleRef.createNestApplication();
		await app.init();
	});

	describe("/POST signIn", () => {
		it("sends 400 if user not existing", () => {
			const userSignInDto: UserSignInDto = {
				username: "David",
				password: "any pw",
			};

			prismaServiceMock.user.findFirst.mockResolvedValue(null);

			return request(app.getHttpServer())
				.post("/auth/signIn")
				.send(userSignInDto)
				.expect(400);
		});

		describe("checks for password", () => {
			const myDummyUser = { ...dummyUser };

			it("sends 201 if authorized", async () => {
				const dummyPassword = "123123";
				const hashedDummyPassword = await bcrypt.hash(dummyPassword, 10);
				myDummyUser.password = hashedDummyPassword;

				const userSignInDto: UserSignInDto = {
					username: "David",
					password: dummyPassword,
				};

				prismaServiceMock.user.findFirst.mockResolvedValue(myDummyUser);

				return request(app.getHttpServer())
					.post("/auth/signIn")
					.send(userSignInDto)
					.expect(201);
			});

			it("sends 400 if password is invalid", async () => {
				const dummyPassword = "123123";
				const hashedDummyPassword = await bcrypt.hash(dummyPassword, 10);
				myDummyUser.password = hashedDummyPassword;

				const userSignInDto: UserSignInDto = {
					username: "David",
					password: "wrong pw",
				};

				prismaServiceMock.user.findFirst.mockResolvedValue(myDummyUser);

				return request(app.getHttpServer())
					.post("/auth/signIn")
					.send(userSignInDto)
					.expect(400);
			});
		});
	});

	describe("/POST signUp", () => {
		it("checks for existing user", () => {
			prismaServiceMock.user.findFirst.mockResolvedValue(dummyUser);

			return request(app.getHttpServer()).post("/auth/signUp").expect(400);
		});

		it("checks for existing email", () => {
			prismaServiceMock.user.findFirst
				.mockResolvedValueOnce(null)
				.mockResolvedValueOnce(dummyUser);

			return request(app.getHttpServer()).post("/auth/signUp").expect(400);
		});

		it("returns success username and email not already exist", () => {
			const userSignUpDto: UserSignUpDto = {
				username: dummyUser.username,
				password: dummyUser.password,
				email: dummyUser.email!,
			};

			prismaServiceMock.user.findFirst
				.mockResolvedValueOnce(null)
				.mockResolvedValueOnce(null);

			prismaServiceMock.user.create.mockResolvedValue(dummyUser);

			return request(app.getHttpServer())
				.post("/auth/signUp")
				.send(userSignUpDto)
				.expect(201);
		});
	});

	afterAll(async () => {
		await app.close();
	});
});

import config from "@config";
import { DatabaseModule } from "@database/database.module";
import { PrismaService } from "@database/database.prisma.service";
import { PrismaService as MockPrismaService } from "@database/__mocks__/database.prisma.service";
import { MailModule } from "@mail/mail.module";
import { INestApplication } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { Test } from "@nestjs/testing";
import { PrismaClient, User } from "@prisma/client";
import { DeepMockProxy } from "jest-mock-extended";
import request from "supertest";
import { AuthController } from "./auth.controller";
import { AuthMailDeliveryService } from "./auth.mail-delivery.service";
import { AuthModule } from "./auth.module";
import { UserSignInDto, UserSignUpDto } from "./auth.user.dtos";
import bcrypt from "bcrypt";

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
};

describe("AuthController", () => {

	let app: INestApplication
	let prismaServiceMock: DeepMockProxy<PrismaClient>;

	beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({
					isGlobal: true,
					load: [config]
				}),
				AuthModule,
				DatabaseModule,
				MailModule
			],
			controllers: [AuthController],
			providers: [AuthMailDeliveryService],
		}).useMocker((token) => {
			if (token === PrismaService) {
				prismaServiceMock = MockPrismaService
				return prismaServiceMock;
			}
			if (token === AuthMailDeliveryService) {
				return {
					sendEmailConfirmationEmail: jest.fn()
				}
			}
		}).compile();

		app = moduleRef.createNestApplication();
		await app.init();
	});

	describe("/POST signIn", () => {
		it("sends 400 if user not existing", () => {

			const userSignInDto: UserSignInDto = {
				username: "David",
				password: "any pw"
			}

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
					password: dummyPassword
				}

				prismaServiceMock.user.findFirst.mockResolvedValue(myDummyUser);

				return request(app.getHttpServer())
					.post("/auth/signIn")
					.send(userSignInDto)
					.expect(201)

			})

			it("sends 401 if not authorized", async () => {
				const dummyPassword = "123123";
				const hashedDummyPassword = await bcrypt.hash(dummyPassword, 10);
				myDummyUser.password = hashedDummyPassword;

				const userSignInDto: UserSignInDto = {
					username: "David",
					password: "wrong pw"
				}

				prismaServiceMock.user.findFirst.mockResolvedValue(myDummyUser);

				return request(app.getHttpServer())
					.post("/auth/signIn")
					.send(userSignInDto)
					.expect(401)
			})

		})
	})

	describe("/POST signUp", () => {
		it("checks for existing user", () => {

			prismaServiceMock.user.findFirst.mockResolvedValue(dummyUser);

			return request(app.getHttpServer())
				.post("/auth/signUp")
				.expect(400);
		});

		it("checks for existing email", () => {

			prismaServiceMock.user.findFirst
				.mockResolvedValueOnce(null)
				.mockResolvedValueOnce(dummyUser);

			return request(app.getHttpServer())
				.post("/auth/signUp")
				.expect(400);
		});

		it("returns success username and email not already exist", () => {

			const userSignUpDto: UserSignUpDto = {
				username: dummyUser.username,
				password: dummyUser.password,
				email: dummyUser.email!
			}

			prismaServiceMock.user.findFirst
				.mockResolvedValueOnce(null)
				.mockResolvedValueOnce(null);

			prismaServiceMock.user.create.mockResolvedValue(dummyUser);

			return request(app.getHttpServer())
				.post("/auth/signUp")
				.send(userSignUpDto)
				.expect(201);
		});
	})

	afterAll(async () => {
		await app.close();
	});
});
import { ConfigModule } from "@nestjs/config";
import { Test } from "@nestjs/testing";
import config from "@src/config";
import { PrismaService } from "../database/prisma.service";
import { AuthService } from "./auth.service";
import { LogService as MockLogService } from "../../log/__mocks__/log.service";
import { PrismaService as PrismaServiceMock } from "../../global/database/__mocks__/prisma.service";
import { LogService } from "@src/modules/log/log.service";
import { UserWithRoles } from "./base-auth.service";

describe("roles authorization", () => {
	const superAdminUser = {
		role: {
			id: "",
			name: "super-admin",
			color: "",
		},
		roleId: null,
		id: "12345",
		username: "johndoe",
		password: "secretpassword",
		email: "johndoe@example.com",
		emailConfirmed: true,
		createdAt: new Date("2022-01-01T00:00:00.000Z"),
		updatedAt: new Date("2022-01-01T01:00:00.000Z"),
		createUser: null,
		updateUser: "amin",
	} satisfies UserWithRoles;

	let authService: AuthService;

	beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({
					isGlobal: true,
					load: [config],
				}),
			],
			providers: [PrismaService, AuthService, LogService],
		})
			.overrideProvider(PrismaService)
			.useValue(PrismaServiceMock)
			.overrideProvider(LogService)
			.useClass(MockLogService)
			.compile();

		authService = moduleRef.get(AuthService);
	});

	test("authorizes super-admin properly", () => {
		expect(authService.isAuthorizedForRole(superAdminUser, "super-admin")).toBe(true);
		expect(authService.isAuthorizedForRole(superAdminUser, "admin")).toBe(true);
		expect(authService.isAuthorizedForRole(superAdminUser, "customer")).toBe(true);
	});

	test("authorizes admin properly", () => {
		const adminUser = {
			...superAdminUser,
			role: {
				id: "",
				color: "",
				name: "admin",
			},
		} satisfies UserWithRoles;
		expect(authService.isAuthorizedForRole(adminUser, "super-admin")).toBe(false);
		expect(authService.isAuthorizedForRole(adminUser, "admin")).toBe(true);
		expect(authService.isAuthorizedForRole(adminUser, "customer")).toBe(true);
	});

	test("authorizes other roles properly", () => {
		const customerUser = {
			...superAdminUser,
			role: {
				id: "",
				color: "",
				name: "customer",
			},
		} satisfies UserWithRoles;
		expect(authService.isAuthorizedForRole(customerUser, "super-admin")).toBe(false);
		expect(authService.isAuthorizedForRole(customerUser, "admin")).toBe(false);
		expect(authService.isAuthorizedForRole(customerUser, "customer")).toBe(true);
	});
});

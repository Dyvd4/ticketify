import { S3Client } from "@aws-sdk/client-s3";
import { Controller, Delete, Get, Param, ParseArrayPipe, Post, Put, Query, Req, UploadedFile, UseInterceptors } from "@nestjs/common";
import { BadRequestException } from "@nestjs/common/exceptions";
import { ConfigService } from "@nestjs/config";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBody, ApiConsumes } from "@nestjs/swagger";
import { Config } from "@src/config";
import { UploadFileDto } from "@src/modules/file/file.dtos";
import { parseImageFilePipe } from "@src/modules/file/file.pipes";
import { FileService } from "@src/modules/file/file.service";
import { PrismaService } from "@src/modules/global/database/prisma.service";
import { InfiniteLoader, Pager } from "@src/lib/list";
import { FilterQueryParams, OrderByQueryParams, getMappedPrismaFilterArgs, getMappedPrismaOrderByArgs } from "@src/lib/list/list";
import { InfiniteLoaderQueryDto, PagerQueryDto } from "@src/lib/list/list.dtos";
import { MailTemplateProvider } from "@src/modules/mail/mail-template.provider";
import { SomeObjDto } from "./dummy.dtos";

@Controller('dummy')
export class DummyController {

	private client: S3Client

	constructor(
		private mailTemplateProvider: MailTemplateProvider,
		private configService: ConfigService,
		private prisma: PrismaService,
		private fileService: FileService
	) {
		const S3_PUBLIC_KEY = configService.get<Config>("S3_PUBLIC_KEY", { infer: true });
		const S3_PRIVATE_KEY = configService.get<Config>("S3_PRIVATE_KEY", { infer: true });
		this.client = new S3Client({
			credentials: {
				accessKeyId: S3_PUBLIC_KEY,
				secretAccessKey: S3_PRIVATE_KEY
			},
			region: "eu-central-1"
		});
	}

	@Get('getTiddies')
	tiddies() {
		return "Gimme them";
	}

	@Get('getHtmlTemplate')
	async getHtmlTemplate() {
		const user = {
			firstName: "David",
			lastName: "Kimmich"
		}
		const html = await this.mailTemplateProvider.getInjectedHtmlFromFile("Test", { user });
		return html;
	}

	@Get("getWithObjectUrlParams")
	getWithObjectUrlParams(
		@Query() someObj: SomeObjDto
	) {
		return someObj;
	}

	@Get("getWithArrayParams")
	getWithArrayParams(
		@Query("excludeIds", new ParseArrayPipe({ items: Number, optional: true })) excludeIds: number[] = []
	) {
		return excludeIds;
	}

	@Get("test")
	async getTestEntities(
		@Query() query: InfiniteLoaderQueryDto
	) {
		const { prisma } = this;
		const pager = new InfiniteLoader(query, 5);

		const testItems = await prisma.test.findMany({
			...pager.getPrismaArgs(),
			where: pager.getPrismaFilterArgs(),
			orderBy: pager.getPrismaOrderByArgs()
		});
		const testItemsCount = await prisma.test.count({
			where: pager.getPrismaFilterArgs(),
			orderBy: pager.getPrismaOrderByArgs()
		});

		return pager.getResult(testItems, testItemsCount);
	}

	@Get("test/pager")
	async getTestEntitiesWithPager(
		@Query() query: PagerQueryDto
	) {
		const { prisma } = this;
		const pager = new Pager(query, 10);

		const testItems = await prisma.test.findMany({
			...pager.getPrismaArgs(),
			where: pager.getPrismaFilterArgs(),
			orderBy: pager.getPrismaOrderByArgs()
		});
		const testItemsCount = await prisma.test.count({
			where: pager.getPrismaFilterArgs(),
			orderBy: pager.getPrismaOrderByArgs()
		});

		return pager.getResult(testItems, testItemsCount);
	}

	@Get('test/woPager')
	async getTestEntitiesWithoutPager(@Req() req: any) {

		const { prisma } = this;

		const testItems = await prisma.test.findMany({
			where: getMappedPrismaFilterArgs(req.query.filter as FilterQueryParams),
			orderBy: getMappedPrismaOrderByArgs(req.query.orderBy as OrderByQueryParams)
		});

		return testItems;
	}


	@Get("error")
	getError() {
		throw new BadRequestException();
	}

	@Put("dumbShit")
	someDumbShit() {
		return "Hello"
	}

	@ApiConsumes("multipart/form-data")
	@ApiBody({
		type: UploadFileDto
	})
	@Post('uploadFile')
	@UseInterceptors(FileInterceptor("file"))
	async uploadFile(@UploadedFile(parseImageFilePipe) file: Express.Multer.File) {
		const uploadedFile = await this.fileService.createOrUpdateFile(file);
		return uploadedFile;
	}

	@Get('file/:id')
	async getFile(@Param("id") id: string) {
		const file = await this.fileService.findFirst({ where: { id } })
		return file;
	}

	@Get("files")
	async getFiles() {
		const files = await this.fileService.findMany()
		return files;
	}

	@Delete("file/:id")
	async deleteFile(@Param("id") id: string) {
		const deletedFile = await this.fileService.deleteOne(id)
		return deletedFile;
	}

}
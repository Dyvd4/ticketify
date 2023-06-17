import {
	Controller,
	Delete,
	Get,
	NotFoundException,
	Param,
	Post,
	Put,
	StreamableFile,
	UploadedFile,
	UploadedFiles,
	UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { ApiBody, ApiConsumes } from "@nestjs/swagger";
import ListResult from "@src/lib/list/result/list-result";
import { PrismaService } from "@src/modules/global/database/prisma.service";
import { UploadFileDto, UploadFilesDto } from "./file.dtos";
import { parseFilePipe, parseImageFilePipe } from "./file.pipes";
import { FileService } from "./file.service";

@Controller()
export class FileController {
	constructor(
		private readonly prisma: PrismaService,
		private readonly fileService: FileService
	) {}

	@Get("files")
	async getFiles() {
		const files = await this.prisma.file.findMany();
		const filesWithSignedUrl = await Promise.all(
			files.map((file) => this.fileService.getFileWithSignedUrl(file))
		);
		return new ListResult(filesWithSignedUrl);
	}

	@Get("file/:id")
	async getFile(@Param("id") id: string) {
		const file = await this.prisma.file.findFirst({
			where: {
				id,
			},
		});
		if (!file) {
			throw new NotFoundException(`File with id ${id} not found`);
		}
		return this.fileService.getFileWithSignedUrl(file);
	}

	@Get("rawFile/:id")
	async getRawFile(@Param("id") id: string) {
		const file = await this.prisma.file.findFirst({
			where: {
				id,
			},
		});
		if (!file) {
			throw new NotFoundException(`File with id ${id} not found`);
		}

		return new StreamableFile(await this.fileService.getRawFile(file));
	}

	@ApiConsumes("multipart/form-data")
	@ApiBody({ type: UploadFilesDto })
	@UseInterceptors(FilesInterceptor("files"))
	@Post("files")
	async createFiles(@UploadedFiles(parseFilePipe) files: Express.Multer.File[]) {
		const createdOrUpdatedFiles = await this.fileService.createOrUpdateFiles(files);
		return new ListResult(
			await Promise.all(
				createdOrUpdatedFiles.map((file) => this.fileService.getFileWithSignedUrl(file))
			)
		);
	}

	@ApiConsumes("multipart/form-data")
	@ApiBody({ type: UploadFilesDto })
	@UseInterceptors(FilesInterceptor("files"))
	@Post("images")
	async createImages(@UploadedFiles(parseImageFilePipe) files: Express.Multer.File[]) {
		const createdOrUpdatedImages = await this.fileService.createOrUpdateFiles(files);
		return new ListResult(
			await Promise.all(
				createdOrUpdatedImages.map((file) => this.fileService.getFileWithSignedUrl(file))
			)
		);
	}

	@ApiConsumes("multipart/form-data")
	@ApiBody({ type: UploadFileDto })
	@UseInterceptors(FileInterceptor("file"))
	@Put("file/:id")
	async updateFile(
		@Param("id") id: string,
		@UploadedFile(parseFilePipe) file: Express.Multer.File
	) {
		const updatedFile = await this.fileService.createOrUpdateFile(file, id);
		return this.fileService.getFileWithSignedUrl(updatedFile);
	}

	@ApiConsumes("multipart/form-data")
	@ApiBody({ type: UploadFileDto })
	@UseInterceptors(FileInterceptor("file"))
	@Put("image/:id")
	async updateImage(
		@Param("id") id: string,
		@UploadedFile(parseImageFilePipe) file: Express.Multer.File
	) {
		const updatedFile = await this.fileService.createOrUpdateFile(file, id);
		return this.fileService.getFileWithSignedUrl(updatedFile);
	}

	@Delete("file/:id")
	async removeFile(@Param("id") id: string) {
		return this.fileService.deleteOne(id);
	}
}

import { Controller, Delete, Get, NotFoundException, Param, Post, Put, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { PrismaService } from '@src/global/database/database.prisma.service';
import ListResult from '@src/lib/list/result/list-result';
import { parseFilePipe, parseImageFilePipe } from './file.pipes';
import { FileService } from './file.service';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { UploadFileDto, UploadFilesDto } from './file.dtos';

@Controller()
export class FileController {

	constructor(
		private readonly prisma: PrismaService,
		private readonly fileService: FileService
	) { }

	@Get('files')
	async getFiles() {
		const files = await this.prisma.file.findMany();
		const filesWithSignedUrl = await Promise.all(files.map(file => this.fileService.getFileWithSignedUrl(file)));
		return new ListResult(filesWithSignedUrl);
	}

	@Get('file/:id')
	async getFile(@Param("id") id: string) {
		const file = await this.prisma.file.findFirst({
			where: {
				id
			}
		});
		if (!file) {
			throw new NotFoundException(`File with id ${id} not found`);
		}
		return this.fileService.getFileWithSignedUrl(file);
	}

	@ApiConsumes("multipart/form-data")
	@ApiBody({ type: UploadFilesDto })
	@UseInterceptors(FilesInterceptor("files"))
	@Post('files')
	async createFiles(@UploadedFiles(parseFilePipe) files: Express.Multer.File[]) {
		const createdOrUpdatedFiles = await this.fileService.createOrUpdateFiles(files);
		return new ListResult(createdOrUpdatedFiles);
	}

	@ApiConsumes("multipart/form-data")
	@ApiBody({ type: UploadFilesDto })
	@UseInterceptors(FilesInterceptor("files"))
	@Post('images')
	async createImages(@UploadedFiles(parseImageFilePipe) files: Express.Multer.File[]) {
		const createdOrUpdatedImages = await this.fileService.createOrUpdateFiles(files);
		return new ListResult(createdOrUpdatedImages);
	}

	@ApiConsumes("multipart/form-data")
	@ApiBody({ type: UploadFileDto })
	@UseInterceptors(FileInterceptor("file"))
	@Put('file/:id')
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
	@Put('image/:id')
	async updateImage(
		@Param("id") id: string,
		@UploadedFile(parseImageFilePipe) file: Express.Multer.File
	) {
		const updatedFile = await this.fileService.createOrUpdateFile(file, id);
		return this.fileService.getFileWithSignedUrl(updatedFile);
	}

	@Delete('file/:id')
	async removeFile(@Param("id") id: string) {
		return this.fileService.deleteOne(id);
	}
}
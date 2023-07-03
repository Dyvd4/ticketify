import {
	DeleteObjectCommand,
	GetObjectCommand,
	PutObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { File, Prisma } from "@prisma/client";
import { Config } from "@src/config";
import { PrismaService } from "@src/modules/global/database/prisma.service";
import { MulterFileToPrismaFileMap } from "./maps/multer-file-to-prisma-file.map";
import { ClientFile, PrismaFileToClientFileMap } from "./maps/prisma-file-to-client.map";

@Injectable()
export class FileService {
	private s3Client: S3Client;
	private S3_BUCKET_NAME: string;
	private FILE_SIGNED_URL_EXPIRING_IN_SECONDS: number;

	constructor(
		private readonly prisma: PrismaService,
		private readonly configService: ConfigService
	) {
		const S3_PUBLIC_KEY = this.configService.get<Config>("S3_PUBLIC_KEY", { infer: true });
		const S3_PRIVATE_KEY = this.configService.get<Config>("S3_PRIVATE_KEY", { infer: true });
		const S3_REGION = this.configService.get<Config>("S3_REGION", { infer: true });

		this.S3_BUCKET_NAME = this.configService.get<Config>("S3_BUCKET_NAME", { infer: true });
		this.s3Client = new S3Client({
			credentials: {
				accessKeyId: S3_PUBLIC_KEY,
				secretAccessKey: S3_PRIVATE_KEY,
			},
			region: S3_REGION,
		});

		this.FILE_SIGNED_URL_EXPIRING_IN_SECONDS = this.configService.get<Config>(
			"FILE_SIGNED_URL_EXPIRING_IN_SECONDS",
			{ infer: true }
		);
	}

	private getFileNameForS3(file: File) {
		return file.id;
	}

	private createOrUpdateFileInS3(prismaFile: File, buffer: Buffer) {
		const command = new PutObjectCommand({
			Bucket: this.S3_BUCKET_NAME,
			Key: this.getFileNameForS3(prismaFile),
			Body: buffer,
		});
		return this.s3Client.send(command);
	}

	private deleteFileInS3(prismaFile: File) {
		const command = new DeleteObjectCommand({
			Bucket: this.S3_BUCKET_NAME,
			Key: this.getFileNameForS3(prismaFile),
		});
		return this.s3Client.send(command);
	}

	async createOrUpdateFiles(filesToCreate: Express.Multer.File[]): Promise<File[]> {
		return Promise.all(filesToCreate.map((file) => this.createOrUpdateFile(file)));
	}

	async createOrUpdateFile(fileToCreate: Express.Multer.File, id?: string): Promise<File> {
		const { prisma } = this;

		const createdOrUpdatedFile = await prisma.file.upsert({
			where: {
				id: id || "",
			},
			create: MulterFileToPrismaFileMap(fileToCreate),
			update: MulterFileToPrismaFileMap(fileToCreate),
		});

		await this.createOrUpdateFileInS3(createdOrUpdatedFile, fileToCreate.buffer);

		return createdOrUpdatedFile;
	}

	async deleteOne(fileId: string): Promise<File> {
		const { prisma } = this;

		const fileToDelete = await prisma.file.findUnique({
			where: {
				id: fileId,
			},
		});

		if (!fileToDelete) {
			throw new NotFoundException(`File with id ${fileId} not found`);
		}

		await this.deleteFileInS3(fileToDelete);

		const deletedFile = await prisma.file.delete({
			where: {
				id: fileToDelete.id,
			},
		});

		return deletedFile;
	}

	async deleteMany(fileIds: string[]): Promise<File[]> {
		return Promise.all(fileIds.map((fileId) => this.deleteOne(fileId)));
	}

	async findFirst(args?: Prisma.FileFindFirstArgs) {
		const { prisma } = this;

		const file = await prisma.file.findFirst(args);

		if (!file) {
			throw new NotFoundException("File not found");
		}

		const clientFile = await this.getFileWithSignedUrl(file);

		return clientFile;
	}

	async findMany(args?: Prisma.FileFindManyArgs) {
		const { prisma } = this;

		const files = await prisma.file.findMany(args);

		const clientFiles = await Promise.all(
			files.map((file) => {
				return this.getFileWithSignedUrl(file);
			})
		);

		return clientFiles;
	}

	async getFileWithSignedUrl(file: File): Promise<ClientFile> {
		const signedUrl = await getSignedUrl(
			this.s3Client,
			new GetObjectCommand({
				Bucket: this.S3_BUCKET_NAME,
				Key: this.getFileNameForS3(file),
			}),
			{ expiresIn: this.FILE_SIGNED_URL_EXPIRING_IN_SECONDS }
		);
		return PrismaFileToClientFileMap(file, signedUrl);
	}

	async getRawFile(file: File): Promise<Buffer> {
		const response = await this.s3Client.send(
			new GetObjectCommand({
				Bucket: this.S3_BUCKET_NAME,
				Key: this.getFileNameForS3(file),
			})
		);
		return Buffer.from(await response.Body!.transformToByteArray());
	}
}

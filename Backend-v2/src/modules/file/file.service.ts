import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PrismaService } from '@src/modules/global/database/database.prisma.service';
import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { File, Prisma } from "@prisma/client";
import { Config } from "@src/config";
import { MulterFileToPrismaFileMap } from "./maps/file.multer-file-to-prisma-file.map";
import { ClientFile, PrismaFileToClientFileMap } from "./maps/file.prisma-file-to-client.map";

@Injectable()
export class FileService {

	private s3Client: S3Client
	private S3_BUCKET_NAME: string

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
				secretAccessKey: S3_PRIVATE_KEY
			},
			region: S3_REGION
		});
	}

	private createOrUpdateFileInS3(fileToCreate: Express.Multer.File) {
		const command = new PutObjectCommand({
			Bucket: this.S3_BUCKET_NAME,
			Key: fileToCreate.originalname,
			Body: fileToCreate.buffer
		});
		return this.s3Client.send(command);
	}

	private deleteFileInS3(fileToDelete: File) {
		const command = new DeleteObjectCommand({
			Bucket: this.S3_BUCKET_NAME,
			Key: fileToDelete.originalFileName
		});
		return this.s3Client.send(command);
	}

	async createOrUpdateFiles(filesToCreate: Express.Multer.File[], id?: string): Promise<File[]> {
		const { prisma } = this;

		await Promise.all(filesToCreate.map(file => this.createOrUpdateFileInS3(file)));

		return prisma.$transaction(filesToCreate.map(file => {
			return prisma.file.upsert({
				where: {
					id: id || ""
				},
				create: MulterFileToPrismaFileMap(file),
				update: MulterFileToPrismaFileMap(file)
			});
		}));
	}

	async createOrUpdateFile(fileToCreate: Express.Multer.File, id?: string): Promise<File> {
		const { prisma } = this;

		await this.createOrUpdateFileInS3(fileToCreate)

		const createdOrUpdatedFile = await prisma.file.upsert({
			where: {
				id: id || ""
			},
			create: MulterFileToPrismaFileMap(fileToCreate),
			update: MulterFileToPrismaFileMap(fileToCreate)
		});

		return createdOrUpdatedFile;
	}

	async deleteOne(fileId: string): Promise<File> {
		const { prisma } = this;

		const fileToDelete = await prisma.file.findUnique({
			where: {
				id: fileId
			}
		})

		if (!fileToDelete) {
			throw new NotFoundException(`File with id ${fileId} not found`)
		}

		await this.deleteFileInS3(fileToDelete);

		const deletedFile = await prisma.file.delete({
			where: {
				id: fileToDelete.id
			}
		});

		return deletedFile;
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

		const clientFiles = await Promise.all(files.map(file => {
			return this.getFileWithSignedUrl(file);
		}));

		return clientFiles;
	}

	async getFileWithSignedUrl(file: File): Promise<ClientFile> {
		const signedUrl = await getSignedUrl(this.s3Client, new GetObjectCommand({
			Bucket: this.S3_BUCKET_NAME,
			Key: file.originalFileName
		}), { expiresIn: 3600 });
		return PrismaFileToClientFileMap(file, signedUrl);
	}
}
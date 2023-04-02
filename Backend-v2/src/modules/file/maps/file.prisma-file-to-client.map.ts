import { File } from "@prisma/client";

export const PrismaFileToClientFileMap = (file: File, url?: string) => {
	return {
		...file,
		contentRoute: `${process.env.FILE_UPLOAD_ROUTE_NAME!}/${file.fileName}`,
		url
	}
}

export type ClientFile = ReturnType<typeof PrismaFileToClientFileMap>;
import config from "@config";
import { File } from "@prisma/client";

const { FILE_UPLOAD_ROUTE_NAME } = config();

// TODO: think about creating a class for it in order to be visible at swagger schema
// (currently only being used internally)
export default function FileEntityToClientDto(file: File) {
	return {
		...file,
		contentRoute: `${FILE_UPLOAD_ROUTE_NAME}/${file.fileName}`
	}
}
import { mockDeep } from "jest-mock-extended";
import { FileService as OriginalFileService } from "../file.service";
export const FileService = mockDeep<OriginalFileService>();

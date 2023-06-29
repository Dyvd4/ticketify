import { Module } from "@nestjs/common";
import { FileModule } from "../file/file.module";
import { CompanyController } from "./company.controller";

@Module({
	imports: [FileModule],
	controllers: [CompanyController],
	providers: [],
})
export class CompanyModule {}

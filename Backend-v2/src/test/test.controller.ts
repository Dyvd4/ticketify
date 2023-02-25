import { Controller, Get } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

@Controller('test')
@ApiBearerAuth()
export class TestController {

	@Get()
	tiddies() {
		return "Gimme them";
	}
}
import { Controller, Get } from "@nestjs/common";

@Controller('test')
export class TestController {

	@Get()
	tiddies() {
		return "Gimme them";
	}
}
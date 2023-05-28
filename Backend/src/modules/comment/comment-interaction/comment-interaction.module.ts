import { Module } from "@nestjs/common";
import { CommentInteractionController } from "./comment-interaction.controller";

@Module({
	controllers: [CommentInteractionController],
	providers: [],
})
export class CommentInteractionModule {}

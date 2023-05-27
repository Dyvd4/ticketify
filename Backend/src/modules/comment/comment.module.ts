import { Module } from "@nestjs/common";
import { FileModule } from "@src/modules/file/file.module";
import { CommentInteractionModule } from "./comment-interaction/comment-interaction.module";
import { CommentController } from "./comment.controller";

@Module({
    imports: [CommentInteractionModule, FileModule],
    controllers: [CommentController],
    providers: [],
})
export class CommentModule {}

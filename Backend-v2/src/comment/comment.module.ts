import { Module } from '@nestjs/common';
import { CommentInteractionModule } from './comment-interaction/comment-interaction.module';
import { CommentController } from './comment.controller';

@Module({
	imports: [CommentInteractionModule],
	controllers: [CommentController],
	providers: []
})
export class CommentModule { }

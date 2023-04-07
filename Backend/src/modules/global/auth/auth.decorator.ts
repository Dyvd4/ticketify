import { SetMetadata } from '@nestjs/common';
import { AuthParams } from './auth.service';

export interface AuthDecoratorParams extends AuthParams {
	disable?: boolean
}

export const Auth = (args?: AuthDecoratorParams) => SetMetadata("authParams", args);
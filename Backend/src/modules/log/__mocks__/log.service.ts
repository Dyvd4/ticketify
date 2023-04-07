import { BaseLogService, BaseLogServiceOptions, DEFAULT_CONTEXT } from '../base-log.service';

export class LogService extends BaseLogService {

	constructor();
	constructor(context: string);
	constructor(context: string, options: BaseLogServiceOptions)
	constructor(context?: string, options?: BaseLogServiceOptions) {
		super(context || DEFAULT_CONTEXT, {
			...options,
			useDbTransport: false,
		});
	}

}
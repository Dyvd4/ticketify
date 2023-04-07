import { ConsoleLogger, ConsoleLoggerOptions, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../global/database/prisma.service';
import { LogLevelColorSchemeMap, LogLevelIconMap } from './log.maps';

type DbTransportOptions = {
	/** whitelist of context to exclude from db logging */
	contextToExclude: string[]
}

type BaseBaseLogServiceOptions = {
	useDbTransport?: true
	dbTransportOptions?: DbTransportOptions
} | {
	useDbTransport?: false
}

export type BaseLogServiceOptions = BaseBaseLogServiceOptions & ConsoleLoggerOptions

export const DEFAULT_CONTEXT = "DEFAULT_CONTEXT"

@Injectable()
export abstract class BaseLogService extends ConsoleLogger {

	@Inject(PrismaService)
	private prisma!: PrismaService
	private useDbTransport?: boolean
	private dbTransportOptions?: DbTransportOptions

	constructor();
	constructor(context: string);
	constructor(context: string, options: BaseLogServiceOptions)
	constructor(context?: string, options?: BaseLogServiceOptions) {
		if (context && !options) super(context);
		else if (context && options) {
			super(context, options);

			const { useDbTransport } = options;
			this.useDbTransport = useDbTransport;

			if (useDbTransport) {
				const { dbTransportOptions } = options;
				this.dbTransportOptions = dbTransportOptions;
			}
		}
		else {
			super();
		}
	}

	private shouldCreateDbLog(context?: string): boolean {

		if (!this.useDbTransport) return false;

		if (context && this.dbTransportOptions?.contextToExclude) {
			return !this.dbTransportOptions?.contextToExclude.includes(context);
		}

		return true;
	}

	async log(message: any, context?: string): Promise<void> {

		if (this.shouldCreateDbLog(context)) {
			await this.prisma.log.create({
				data: {
					level: "info",
					message,
					context,
					icon: LogLevelIconMap["info"],
					color: LogLevelColorSchemeMap["info"]
				}
			});
		}

		super.log(message, context);
	}

	async error(message: any, stack?: string, context?: string) {

		if (this.shouldCreateDbLog(context)) {
			await this.prisma.log.create({
				data: {
					level: "error",
					message,
					context,
					stack,
					icon: LogLevelIconMap["error"],
					color: LogLevelColorSchemeMap["error"]
				}
			});
		}

		super.error(message, stack, context);
	}

	async warn(message: any, context?: string): Promise<void> {

		if (this.shouldCreateDbLog(context)) {
			await this.prisma.log.create({
				data: {
					level: "warn",
					message,
					context,
					icon: LogLevelIconMap["warn"],
					color: LogLevelColorSchemeMap["warn"]
				}
			});
		}

		super.warn(message, context);
	}
}
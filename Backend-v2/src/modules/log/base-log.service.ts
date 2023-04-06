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

	log(message: any, context?: string): Promise<void>;
	log(message: any, ...optionalParams: [...any, string?]): Promise<void>;
	async log(message: any, ...optionalParams: any[]): Promise<void> {

		if (this.shouldCreateDbLog(optionalParams[optionalParams.length - 1])) {
			await this.prisma.log.create({
				data: {
					level: "info",
					message,
					context: optionalParams[optionalParams.length - 1],
					icon: LogLevelIconMap["info"],
					color: LogLevelColorSchemeMap["info"]
				}
			});
		}

		super.log(message, ...optionalParams);
	}

	error(message: any, stack?: string, context?: string): Promise<void>;
	error(message: any, ...optionalParams: [...any, string?, string?]): Promise<void>;
	async error(message: any, ...optionalParams: any[]) {

		if (this.shouldCreateDbLog(optionalParams[optionalParams.length - 1])) {
			await this.prisma.log.create({
				data: {
					level: "error",
					message,
					context: optionalParams[optionalParams.length - 1],
					stack: optionalParams[optionalParams.length - 2],
					icon: LogLevelIconMap["error"],
					color: LogLevelColorSchemeMap["error"]
				}
			});
		}

		super.error(message, ...optionalParams);
	}

	warn(message: any, context?: string | undefined): Promise<void>;
	warn(message: any, ...optionalParams: [...any, string?]): Promise<void>;
	async warn(message: any, ...optionalParams: any[]): Promise<void> {

		if (this.shouldCreateDbLog(optionalParams[optionalParams.length - 1])) {
			await this.prisma.log.create({
				data: {
					level: "warn",
					message,
					context: optionalParams[optionalParams.length - 1],
					icon: LogLevelIconMap["warn"],
					color: LogLevelColorSchemeMap["warn"]
				}
			});
		}

		super.warn(message, ...optionalParams);
	}
}
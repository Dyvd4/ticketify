import { MaxFileSizeValidator, MaxFileSizeValidatorOptions } from "@nestjs/common";

interface CustomMaxFileSizeValidatorOptions extends MaxFileSizeValidatorOptions {
	/** - defaults to `byte`
	 * - uses `Intl.NumberFormat` */
	format?: "megabyte" | "kilobyte" | "byte";
}

export class CustomMaxFileSizeValidator extends MaxFileSizeValidator {
	protected validationOptions: CustomMaxFileSizeValidatorOptions;

	constructor(validationOptions: CustomMaxFileSizeValidatorOptions) {
		super(validationOptions);
		this.validationOptions = validationOptions;
	}

	buildErrorMessage(): string {
		return `Validation failed (expected size is less than ${this.getFormattedSize()})`;
	}

	private getFormattedSize(): string {
		const { maxSize, format = "byte" } = this.validationOptions;

		const formatter = new Intl.NumberFormat("de-DE", {
			style: "unit",
			unit: format,
		});

		let convertedMaxSize: number;

		switch (format) {
			case "megabyte":
				convertedMaxSize = maxSize / 1e6;
				break;
			case "kilobyte":
				convertedMaxSize = maxSize / 1e3;
				break;
			default:
				convertedMaxSize = maxSize;
				break;
		}

		return formatter.format(convertedMaxSize);
	}
}

import { UserSettings as UserSettingsModel } from "@prisma/client";
import { IsBoolean, IsOptional } from "class-validator";

type UserSettings = Pick<
	UserSettingsModel,
	| "allowFilterItemsByUrl"
	| "allowSortItemsByUrl"
	| "allowFilterItemsByLocalStorage"
	| "allowSortItemsByLocalStorage"
>;

export class UpdateUserSettingsDto implements Partial<UserSettings> {
	@IsBoolean()
	@IsOptional()
	allowFilterItemsByUrl?: boolean;
	@IsBoolean()
	@IsOptional()
	allowSortItemsByUrl?: boolean;
	@IsBoolean()
	@IsOptional()
	allowFilterItemsByLocalStorage?: boolean;
	@IsBoolean()
	@IsOptional()
	allowSortItemsByLocalStorage?: boolean;
}

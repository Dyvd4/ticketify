import { JestConfigWithTsJest } from "ts-jest";
import { pathsToModuleNameMapper } from "ts-jest";
import { compilerOptions } from "./tsconfig.json";

const config: JestConfigWithTsJest = {
	preset: "ts-jest",
	testEnvironment: "node",
	roots: ["<rootDir>"],
	modulePaths: [compilerOptions.baseUrl],
	moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
	moduleFileExtensions: ["js", "json", "ts"],
	testRegex: ".*\\.spec\\.ts$",
	transform: {
		"^.+\\.(t|j)s$": "ts-jest",
	},
	collectCoverageFrom: ["**/*.(t|j)s"],
	coverageDirectory: "../coverage",
};
export default config;

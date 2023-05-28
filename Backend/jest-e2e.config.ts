import { JestConfigWithTsJest } from "ts-jest";
import baseJestConfig from "./jest.config";

const config: JestConfigWithTsJest = {
	...baseJestConfig,
	testRegex: "\\.e2e-spec\\.ts$",
};
export default config;

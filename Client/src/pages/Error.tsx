import { ComponentPropsWithRef, PropsWithChildren } from "react";
import ErrorAlert from "src/components/ErrorAlert";

type _ErrorProps = {};

export type ErrorProps = _ErrorProps &
	Omit<PropsWithChildren<ComponentPropsWithRef<"div">>, keyof _ErrorProps>;

function Error({ className, ...props }: ErrorProps) {
	return <ErrorAlert />;
}

export default Error;

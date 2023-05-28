import { Button } from "@chakra-ui/react";
import { ComponentPropsWithRef, PropsWithChildren } from "react";

type EditInputProps = PropsWithChildren<{
	onAbort(...args: any[]): void;
	onSave(...args: any[]): void;
}> &
	ComponentPropsWithRef<"div">;

function EditInput({ children, onAbort, onSave, ...props }: EditInputProps) {
	return (
		<div className="flex flex-col" {...props}>
			{children}
			<div className="mt-2 flex items-center justify-start gap-2">
				<Button onClick={onAbort}>Abort</Button>
				<Button onClick={onSave} colorScheme="blue">
					Submit
				</Button>
			</div>
		</div>
	);
}

export default EditInput;

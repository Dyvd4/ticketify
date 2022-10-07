import { Button } from "@chakra-ui/react";

type InlineStyleButtonProps = {
    active: boolean
} & React.ComponentPropsWithRef<"button">

function InlineStyleButton({ children, active, ...props }: InlineStyleButtonProps) {
    return (
        <Button
            className={`${active ? `bg-gray-300 hover:bg-gray-400
                       dark:bg-gray-600 dark:hover:bg-gray-500` : ""}`}
            size="xs"
            onClick={props.onClick}
            {...props}>
            {children}
        </Button>
    );
}

export default InlineStyleButton;
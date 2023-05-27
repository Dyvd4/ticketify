import { Box, LinkBox, LinkOverlay } from "@chakra-ui/react";

type ListLinkProps = {
    name: string;
    count: number;
    href: string;
    action?: {
        icon: any;
        onClick(...args: any[]): void;
    };
};

function ListLink(props: ListLinkProps) {
    const { name, count, href, action } = props;

    return (
        <LinkBox
            className="w-72 rounded-md bg-gray-200
                      p-4 dark:bg-gray-700"
        >
            <LinkOverlay href={href}>{name}</LinkOverlay>
            <Box>{count}</Box>
            {action && (
                <>
                    <Box onClick={action.onClick}>{action.icon}</Box>
                </>
            )}
        </LinkBox>
    );
}

export default ListLink;

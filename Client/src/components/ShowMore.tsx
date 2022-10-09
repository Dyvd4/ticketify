import { Box } from "@chakra-ui/react";
import { ComponentPropsWithRef } from "react";

type ShowMoreProps = {
    showMore: boolean
} & ComponentPropsWithRef<"div">

function ShowMore({ showMore, ...props }: ShowMoreProps) {
    return (
        <Box
            {...props}
            className="pl-1 my-1 text-secondary hover:underline cursor-pointer text-sm">
            {showMore
                ? "Read more"
                : "Show less"}
        </Box>
    );
}

export default ShowMore;
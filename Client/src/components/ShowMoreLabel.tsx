import { Box } from "@chakra-ui/react";
import { ComponentPropsWithRef } from "react";
import useHasOverflow from "src/hooks/useHasOverflow";

type ShowMoreProps = {
    contentRef: React.MutableRefObject<HTMLElement | null>
    contentNoOfLines: number
    defaultContentNoOfLines: number
    setContentNoOfLines(...args: any[]): void
} & Omit<ComponentPropsWithRef<"div">, "children">

/** 
 * - shows a "show more"-label if the provided `contentRef` has overflow
 * - the label is clickable and toggles the `contentNoOfLines` so that it shows the whole content of the `contentRef`
 *  */
function ShowMoreLabel({ contentRef, contentNoOfLines, defaultContentNoOfLines, ...props }: ShowMoreProps) {

    const contentHasOverflow = useHasOverflow(contentRef);
    const showMore = contentNoOfLines === defaultContentNoOfLines;

    return contentHasOverflow
        ? <Box
            data-testid="ShowMoreLabel"
            {...props}
            className="pl-1 my-1 text-secondary hover:underline cursor-pointer text-sm"
            onClick={() => props.setContentNoOfLines(showMore ? 100000000000 : defaultContentNoOfLines)}>
            {showMore
                ? "Show more"
                : "Show less"}
        </Box>
        : null
}

export default ShowMoreLabel;
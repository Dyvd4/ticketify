import { Button } from "@chakra-ui/react";
import { actionBackgroundColor, actionBackgroundColorInactive } from "src/data/tailwind";
import { mapColorProps } from "src/utils/component";

type PagerProps = {
    currentPage: number
    pagesCount: number
    onChange?(page: number)
} & React.ComponentPropsWithRef<"div">

function Pager({ currentPage, pagesCount, onChange, ...props }: PagerProps) {
    return (
        <div className="flex gap-2 m-4" {...props}>
            {new Array(pagesCount)
                .fill(undefined)
                .map((item, index) => index + 1)
                .map((pageNumber) => (
                    <Button
                        key={pageNumber}
                        className={`${currentPage !== pageNumber
                            ? mapColorProps([actionBackgroundColorInactive])
                            : mapColorProps([actionBackgroundColor])}`}
                        onClick={() => onChange && onChange(pageNumber)}>
                        {pageNumber}
                    </Button>
                ))}
        </div>
    )
}

export default Pager;
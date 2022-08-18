import { Heading } from "@chakra-ui/react";
import { faFilter, faSort } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAtom } from "jotai";
import { filterDrawerAtom, sortDrawerAtom } from "src/context/atoms";
import IconButton from "../Wrapper/IconButton";

type HeaderProps = {
    title: string
    count: number
    showCount?: boolean
    useSort: boolean
    useFilter: boolean
}

function Header(props: HeaderProps) {
    const { title, count, showCount, useSort, useFilter } = props;
    const { 1: setSortDrawer } = useAtom(sortDrawerAtom);
    const { 1: setFilterDrawer } = useAtom(filterDrawerAtom);
    return (
        <Heading className="text-center my-8 dark:text-gray-400 mb-2 flex justify-center items-center gap-2">
            <>
                <span>
                    {title}
                </span>
                {showCount && <>
                    ({count})
                </>}
                {!!useSort && <>
                    <IconButton
                        size={"sm"}
                        onClick={() => setFilterDrawer(true)}
                        aria-label="filter"
                        icon={<FontAwesomeIcon icon={faFilter} />}
                    />
                </>}
                {!!useFilter && <>
                    <IconButton
                        size={"sm"}
                        onClick={() => setSortDrawer(true)}
                        aria-label="sort"
                        icon={<FontAwesomeIcon icon={faSort} />}
                    />
                </>}
            </>
        </Heading>
    );
}

export default Header;

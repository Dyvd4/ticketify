import { Heading, Input, Tooltip } from "@chakra-ui/react";
import { faAdd, faFilter, faSort } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAtom } from "jotai";
import { filterDrawerAtom, sortDrawerAtom } from "src/context/atoms";
import { searchItemAtom } from "src/context/stores/search";
import IconButton from "../Wrapper/IconButton";

type HeaderProps = {
    title: string
    count: number
    showCount?: boolean
    useSort: boolean
    useFilter: boolean
    useSearch: boolean
    onAdd?(...args: any[]): void
}

function Header(props: HeaderProps) {

    const { title, count, showCount, useSort, useFilter, useSearch, onAdd } = props;

    const { 1: setSortDrawer } = useAtom(sortDrawerAtom);
    const { 1: setFilterDrawer } = useAtom(filterDrawerAtom);
    const [searchItem, setSearchItem] = useAtom(searchItemAtom);

    return (
        <Heading
            data-testid="ListHeader"
            className="text-center my-8 mb-2 flex justify-between items-center gap-2">
            <div className="flex items-center justify-center gap-2 text-2xl sm:text-3xl">
                <span>
                    {title}
                </span>
                {showCount && <>
                    <span>
                        ({count})
                    </span>
                </>}
            </div>
            {!!useSearch && <>
                <Input
                    placeholder={searchItem!.label}
                    onChange={(e) => setSearchItem({ ...searchItem!, value: e.target.value })}
                    value={searchItem!.value}
                    type={"search"}
                />
            </>}
            <div className="flex items-center justify-center gap-2">
                {!!onAdd && <>
                    <Tooltip
                        label="add"
                        placement="top"
                        aria-label="add">
                        <span className="flex justify-center items-center">
                            <IconButton
                                colorScheme={"cyan"}
                                size={"sm"}
                                onClick={onAdd}
                                aria-label="add"
                                icon={<FontAwesomeIcon icon={faAdd} />}
                            />
                        </span>
                    </Tooltip>
                </>}
                {!!useSort && <>
                    <Tooltip
                        label="sort"
                        placement="top"
                        aria-label="sort">
                        <span className="flex justify-center items-center">
                            <IconButton
                                data-testid="ListHeader-sort-button"
                                size={"sm"}
                                onClick={() => setSortDrawer(true)}
                                aria-label="sort"
                                icon={<FontAwesomeIcon icon={faSort} />}
                            />
                        </span>
                    </Tooltip>
                </>}
                {!!useFilter && <>
                    <Tooltip
                        label="filter"
                        placement="top"
                        aria-label="filter">
                        <span className="flex justify-center items-center">
                            <IconButton
                                data-testid="ListHeader-filter-button"
                                size={"sm"}
                                onClick={() => setFilterDrawer(true)}
                                aria-label="filter"
                                icon={<FontAwesomeIcon icon={faFilter} />}
                            />
                        </span>
                    </Tooltip>
                </>}
            </div>
        </Heading>
    );
}

export default Header;

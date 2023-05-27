import {
    Button,
    Menu,
    MenuButton,
    MenuItemOption,
    MenuList,
    MenuOptionGroup,
} from "@chakra-ui/react";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ComponentPropsWithRef, PropsWithChildren } from "react";
import Pager from ".";
import { PagerProps } from "./Pager";

export const ITEMS_PER_PAGE_STEPS = [10, 20, 50, 100, 200] as const;

type _PagerSectionProps = {
    itemsPerPage: number;
    setItemsPerPage(itemsPerPage: number): void;
    pagerProps: PagerProps;
};

export type PagerSectionProps = PropsWithChildren<_PagerSectionProps> &
    Omit<ComponentPropsWithRef<"div">, keyof _PagerSectionProps>;

function PagerSection({
    className,
    pagerProps,
    setItemsPerPage,
    itemsPerPage,
    ...props
}: PagerSectionProps) {
    return (
        <div className={`${className} my-4 ml-auto flex items-center justify-end gap-4`} {...props}>
            <Menu>
                {({ isOpen }) => (
                    <>
                        <MenuButton
                            isActive={isOpen}
                            as={Button}
                            size={"sm"}
                            rightIcon={<FontAwesomeIcon icon={faChevronDown} />}
                        >
                            {itemsPerPage}
                        </MenuButton>
                        <MenuList>
                            <MenuOptionGroup
                                type="radio"
                                value={itemsPerPage.toString()}
                                onChange={(itemsPerPage) => setItemsPerPage(+itemsPerPage)}
                            >
                                {ITEMS_PER_PAGE_STEPS.map((step) => (
                                    <MenuItemOption key={step} value={step.toString()}>
                                        {step}
                                    </MenuItemOption>
                                ))}
                            </MenuOptionGroup>
                        </MenuList>
                    </>
                )}
            </Menu>
            <Pager {...pagerProps} />
        </div>
    );
}

export default PagerSection;

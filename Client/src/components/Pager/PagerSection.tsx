import { Button, Menu, MenuButton, MenuItemOption, MenuList, MenuOptionGroup } from '@chakra-ui/react';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ComponentPropsWithRef, PropsWithChildren } from 'react';
import Pager from '.';
import { PagerProps } from './Pager';

export const ITEMS_PER_PAGE_STEPS = [10, 20, 50, 100, 200] as const

type _PagerSectionProps = {
    itemsPerPageStep: number
    itemsPerPageChange(itemsPerPage: number): void
    pagerProps: PagerProps
}

export type PagerSectionProps = PropsWithChildren<_PagerSectionProps> &
    Omit<ComponentPropsWithRef<'div'>, keyof _PagerSectionProps>

function PagerSection({ className, pagerProps, itemsPerPageChange, itemsPerPageStep, ...props }: PagerSectionProps) {
    return (
        <div
            className={`${className} ml-auto flex items-center justify-end`}
            {...props}>
            <Menu>
                {({ isOpen }) => (
                    <>
                        <MenuButton
                            isActive={isOpen}
                            as={Button}
                            rightIcon={<FontAwesomeIcon icon={faChevronDown} />}>
                            {itemsPerPageStep}
                        </MenuButton>
                        <MenuList>
                            <MenuOptionGroup
                                type="radio"
                                value={itemsPerPageStep.toString()}
                                onChange={(itemsPerPage) => itemsPerPageChange(+itemsPerPage)}>
                                {ITEMS_PER_PAGE_STEPS.map(step => (
                                    <MenuItemOption
                                        key={step}
                                        value={step.toString()}>
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
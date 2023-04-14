import { Box } from '@chakra-ui/react';
import { IconProp, SizeProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import BaseSidebarListItem from '.';
import { BaseSidebarItemProps } from './BaseSidebarListItem';

type _SidebarItemProps = {
    title: string
    icon?: IconProp
    count?: number
}
export type SidebarItemProps = _SidebarItemProps &
    Omit<BaseSidebarItemProps, "children">

function SidebarItem({ className, count, variant = "horizontal", title, ...props }: SidebarItemProps) {
    return (
        <BaseSidebarListItem
            {...props}>
            {isActive => (
                <Box
                    className={classNames("flex items-center justify-center rounded-xl", {
                        'flex-col gap-2': variant === "vertical"
                    })}>

                    {props.icon && <>
                        <FontAwesomeIcon
                            icon={props.icon}
                            size={(variant === "vertical" ? "xl" : "1x") as SizeProp}
                            className="aspect-square" />
                    </>}

                    <Box as="h3" className={classNames(``, {
                        "font-bold": isActive,
                        "ml-6 mr-auto": variant === "horizontal",
                        "text-sm": variant === "vertical"
                    })}>
                        {title}
                    </Box>

                    {count && variant === "horizontal" && <>
                        <div className='text-secondary text-sm'>{count}</div>
                    </>}
                </Box>
            )}
        </BaseSidebarListItem>
    )
}

export default SidebarItem;
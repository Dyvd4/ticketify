import { Box } from '@chakra-ui/react';
import { IconProp, SizeProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { ComponentPropsWithRef } from 'react';

type _SidebarItemProps = {
    children: React.ReactNode
    icon?: IconProp
    count?: number
    isActive?: boolean
    variant?: "vertical" | "horizontal"
}
export type SidebarItemProps = _SidebarItemProps & Omit<ComponentPropsWithRef<"div">, keyof _SidebarItemProps>

function SidebarItem({ className, children, count, isActive, variant = "horizontal", ...props }: SidebarItemProps) {
    return (
        <Box
            className={classNames("flex items-center justify-center rounded-xl px-4 py-2", {
                'flex-col gap-2': variant === "vertical"
            })}
            {...(isActive ? { color: "blue.200" } : {})}
            {...props}>

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
                {children}
            </Box>

            {count && variant === "horizontal" && <>
                <div className='text-secondary text-sm'>{count}</div>
            </>}
        </Box>
    );
}

export default SidebarItem;
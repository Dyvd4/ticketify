import { Link } from '@chakra-ui/react';
import { ComponentPropsWithRef } from 'react';

export type Variant = "vertical" | "horizontal"
export type _BaseSidebarItemProps = {
    children(isActive: boolean): React.ReactNode
    variant?: Variant
    urlPath?: string
}
export type BaseSidebarItemProps = _BaseSidebarItemProps & Omit<ComponentPropsWithRef<"a">, keyof _BaseSidebarItemProps>

function BaseSidebarItem({ className, children, variant = "horizontal", urlPath, ...props }: BaseSidebarItemProps) {

    const isActive = window.location.pathname === urlPath;

    return (
        <Link
            href={urlPath}
            className={`${className}`}
            _hover={{
                color: "blue.100"
            }}
            _light={{
                _hover: {
                    color: "blue.500"
                },
                ...(isActive ? { color: "blue.600" } : {})
            }}
            {...(isActive ? { color: "blue.200" } : {})}
            {...props}>
            {children(isActive)}
        </Link>
    );
}

export default BaseSidebarItem;
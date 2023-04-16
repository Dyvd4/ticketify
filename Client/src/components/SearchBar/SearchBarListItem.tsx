import { Box, Heading, Highlight, Link } from '@chakra-ui/react';
import { faArrowTurnDown, faTicket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ComponentPropsWithRef, PropsWithChildren } from 'react';

const COLOR_MAP = {
    _light: {
        backgroundColor: "gray.200"
    },
    backgroundColor: "gray.600",
    _hover: {
        _light: {
            backgroundColor: "blue.400"
        },
        backgroundColor: "blue.500",
    }
}

type _SearchBarListItemProps = {
    title: string
    description: string
    href: string
    highlightQuery: string
    enableHoverColors?: boolean
    isActive?: boolean
}

export type SearchBarListItemProps = PropsWithChildren<_SearchBarListItemProps> &
    Omit<ComponentPropsWithRef<'a'>, keyof _SearchBarListItemProps>

function SearchBarListItem(props: SearchBarListItemProps) {

    const {
        className,
        title,
        description,
        href,
        enableHoverColors,
        isActive,
        highlightQuery,
        ...rest
    } = props;

    const hoverBackgroundColorProps = enableHoverColors
        ? { _hover: { ...COLOR_MAP._hover } }
        : {}

    const backgroundColorProps = {
        _light: {
            backgroundColor: isActive
                ? COLOR_MAP._hover._light.backgroundColor
                : COLOR_MAP._light.backgroundColor
        },
        backgroundColor: isActive
            ? COLOR_MAP._hover.backgroundColor
            : COLOR_MAP.backgroundColor
    }

    return (
        <Link
            href={href}
            className={`${className} rounded-md p-4 flex items-center 
                        gap-4 hover:no-underline`}
            {...backgroundColorProps}
            {...hoverBackgroundColorProps}
            {...rest}>
            <FontAwesomeIcon
                className='text-secondary'
                icon={faTicket}
                size={"1x"}
            />
            <Box className='flex w-full justify-between items-center min-w-0'>
                <Box className='flex flex-col min-w-0 truncate'>
                    <Box className='text-xs text-secondary'>
                        {description}
                    </Box>
                    <Heading as="h2" className='text-lg m-0 leading-tight'>
                        <Highlight
                            styles={{
                                backgroundColor: "orange.300"
                            }}
                            query={highlightQuery}>
                            {title}
                        </Highlight>
                    </Heading>
                </Box>
                <FontAwesomeIcon
                    className="rotate-90 text-secondary"
                    icon={faArrowTurnDown}
                    size={"1x"}
                />
            </Box>
        </Link>
    );
}

export default SearchBarListItem;
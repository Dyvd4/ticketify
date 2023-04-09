import { Heading, Link, Tooltip } from '@chakra-ui/react';
import { SizeProp } from '@fortawesome/fontawesome-svg-core';
import { faBook, faFireFlameCurved, faFlask, faTicket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { PropsWithChildren } from 'react';
import { useQuery } from 'react-query';
import { fetchEntity } from 'src/api/entity';
import BgBox, { BgBoxProps } from 'src/components/BgBox';
import useSidebarToggle from 'src/context/hooks/useSidebarToggle';
import { useCurrentUserWithAuthentication } from 'src/hooks/user';
import SidebarItem from './SidebarListItem';

type _SidebarProps = {}

export type SidebarProps = PropsWithChildren<_SidebarProps> & BgBoxProps

function Sidebar({ className, ...props }: SidebarProps) {
    const path = window.location.pathname;

    const { isAuthenticated } = useCurrentUserWithAuthentication({ includeAllEntities: true });
    const [sidebarIsCollapsed] = useSidebarToggle();

    const { data: ticketCount } = useQuery(["ticketCount"], () => fetchEntity({
        route: "tickets/count"
    }));

    const { data: logCount } = useQuery(["logCount"], () => fetchEntity({
        route: "logs/count"
    }));

    if (!isAuthenticated) return null;

    return (
        <BgBox
            backgroundColor={"gray.900"}
            _light={{
                backgroundColor: "white"
            }}
            variant='child'
            as="ul"
            id="sidebar"
            className={classNames(`${className} rounded-none border-r-2 h-screen 
                                    flex flex-col`, {
                "gap-4": !sidebarIsCollapsed,
                "gap-6": sidebarIsCollapsed
            })}
            {...props}>
            {!sidebarIsCollapsed && <>
                <Link href="/">
                    <Heading
                        as="h1"
                        className="text-xl pt-6 pb-8 px-4"
                        {...(path === "/" ? { color: "blue.200" } : {})}>
                        <Tooltip placement="bottom" label="Home" shouldWrapChildren>
                            <span className='mr-2'>
                                Ticketify
                            </span>
                            <FontAwesomeIcon icon={faFireFlameCurved} />
                        </Tooltip>
                    </Heading>
                </Link>
            </>}
            {sidebarIsCollapsed && <>
                <Link href="/">
                    <Heading
                        as="h1"
                        className="text-base pt-6 pb-8 px-4 flex justify-center"
                        {...(path === "/" ? { color: "blue.200" } : {})}>
                        <Tooltip placement="bottom" label="Home" shouldWrapChildren>
                            <FontAwesomeIcon icon={faFireFlameCurved} size={"xl" as SizeProp} />
                        </Tooltip>
                    </Heading>
                </Link>
            </>}
            <Link href="/Ticket">
                <SidebarItem
                    variant={!sidebarIsCollapsed ? "horizontal" : "vertical"}
                    icon={faTicket}
                    isActive={path === "/Ticket"}
                    count={ticketCount}>
                    Tickets
                </SidebarItem>
            </Link>
            <Link href="/Log">
                <SidebarItem
                    variant={!sidebarIsCollapsed ? "horizontal" : "vertical"}
                    icon={faBook}
                    isActive={path === "/Log"}
                    count={logCount}>
                    Logs
                </SidebarItem>
            </Link>
            <Link href="/Test">
                <SidebarItem
                    variant={!sidebarIsCollapsed ? "horizontal" : "vertical"}
                    icon={faFlask}
                    isActive={path === "/Test"}>
                    Test
                </SidebarItem>
            </Link>
        </BgBox>
    )
}

export default Sidebar;
import { Box, Link, Text, Tooltip } from "@chakra-ui/react";
import { library } from '@fortawesome/fontawesome-svg-core';
import { IconName, faComment, faTicket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useState } from "react";
import BgBox from "../BgBox";
import ShowMoreLabel from "../ShowMoreLabel";

library.add(faComment, faTicket);

type ActivityProps = {
    activity: {
        ticket: any
        title: string
        icon: IconName
        color: string
        createdFrom: any
        description?: string
    }
}

const defaultNoOfContentLines = 4;

function Activity({ activity }: ActivityProps) {

    const contentBoxRef = useRef<HTMLDivElement | null>(null);
    const [noOfContentLines, setNoOfContentLines] = useState(defaultNoOfContentLines);

    return (
        <BgBox className={`flex gap-2 max-w-sm overflow-hidden`}>
            <Box className="rounded-full aspect-square">
                <FontAwesomeIcon icon={activity.icon || "pen"} size={"lg"} />
            </Box>
            <Box className="min-w-0">
                <Box>
                    {activity.ticket && <>
                        <Tooltip label="Go to ticket" placement="top-start">
                            <Link
                                href={`Ticket/Details/${activity.ticket.id}`}
                                className="hover:underline flex justify-between items-center gap-2 whitespace-nowrap">
                                <div className="min-w-0 truncate">
                                    #{activity.ticket.id} {activity.ticket.title}
                                </div>
                                <div className={`text-${activity.color} text-sm`}>
                                    ({activity.title})
                                </div>
                            </Link>
                        </Tooltip>
                    </>}
                    {!activity.ticket && <>
                        <Text>
                            (deleted ticket)
                        </Text>
                    </>}
                </Box>
                <Box
                    ref={contentBoxRef}
                    noOfLines={noOfContentLines}
                    className={`text-sm text-secondary ${!!activity.description ? "mt-1" : ""}`}>
                    {activity.description}
                </Box>
                <ShowMoreLabel
                    contentRef={contentBoxRef}
                    contentNoOfLines={noOfContentLines}
                    setContentNoOfLines={setNoOfContentLines}
                    defaultContentNoOfLines={defaultNoOfContentLines}
                />
            </Box>
        </BgBox>
    );
}

export default Activity;
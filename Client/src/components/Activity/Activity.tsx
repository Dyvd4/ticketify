import { Box, Flex, Link, Text } from "@chakra-ui/react";
import { library } from '@fortawesome/fontawesome-svg-core';
import { faComment, IconName } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

library.add(faComment);

type ActivityProps = {
    activity: {
        ticket: any
        entityName: string
        action: string
        icon: IconName
        color: string
        createdFrom: any
    }
}

function Activity({ activity }: ActivityProps) {
    return (
        <Flex className={`rounded-md p-4 gap-4
                        bg-gray-200 dark:bg-gray-700 
                        
                        w-72`}>
            <Box className="p-2 rounded-full aspect-square">
                <FontAwesomeIcon icon={activity.icon || "pen"} size={"2x"} />
            </Box>
            <Box>
                <Box noOfLines={1}>
                    {activity.ticket && <>
                        <Link
                            href={`Ticket/Details/${activity.ticket.id}`}
                            className="hover:underline text-lg">
                            #{activity.ticket.id} {activity.ticket.title}
                        </Link>
                    </>}
                    {!activity.ticket && <>
                        <Text className="text-lg">
                            (deleted ticket)
                        </Text>
                    </>}
                </Box>
                <Box className="text-sm italic">
                    {activity.entityName} has been &nbsp;
                    <span className={`text-${activity.color}`}>
                        {activity.action}
                    </span>
                </Box>
            </Box>
        </Flex>
    );
}

export default Activity;
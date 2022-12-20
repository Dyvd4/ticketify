import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Heading } from "@chakra-ui/react";
import { UseInfiniteQueryResult } from "react-query";
import TicketActivityList from "src/components/Lists/TicketActivity/TicketActivityList";
import { useInfiniteQueryCount } from "src/hooks/infiniteQuery";

type TicketActivitySectionProps = {
    activitiesQuery: UseInfiniteQueryResult<any>
}

function TicketActivitySection({ activitiesQuery }: TicketActivitySectionProps) {

    const activitiesCount = useInfiniteQueryCount(activitiesQuery);

    return (
        <Box className="mt-6">
            <Accordion allowToggle>
                <AccordionItem>
                    <AccordionButton>
                        <Heading className="text-2xl flex-grow text-left">
                            Activity ({activitiesCount})
                        </Heading>
                        <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel>
                        <TicketActivityList
                            activitiesQuery={activitiesQuery}
                            ticketActivityListItemProps={{
                                linkIsDisabled: true,
                                tooltipDisabled: true
                            }}
                        />
                    </AccordionPanel>
                </AccordionItem>
            </Accordion>
        </Box>
    );
}

export default TicketActivitySection;
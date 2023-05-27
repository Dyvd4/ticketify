import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    Heading,
} from "@chakra-ui/react";
import { UseInfiniteQueryResult } from "react-query";
import TicketActivityList from "src/components/Lists/TicketActivity/TicketActivityList";
import { useInfiniteQueryCount } from "src/hooks/query";

type TicketActivitySectionProps = {
    activitiesQuery: UseInfiniteQueryResult<any>;
};

function TicketActivitySection({ activitiesQuery }: TicketActivitySectionProps) {
    const activitiesCount = useInfiniteQueryCount(activitiesQuery);

    return (
        <Box className="mt-6">
            <Accordion allowToggle>
                <AccordionItem>
                    <AccordionButton>
                        <Heading className="flex-grow text-left text-2xl">
                            Activity ({activitiesCount})
                        </Heading>
                        <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel>
                        <TicketActivityList
                            variant={"load-more-button"}
                            activitiesQuery={activitiesQuery}
                            ticketActivityListItemProps={{
                                linkIsDisabled: true,
                                tooltipDisabled: true,
                            }}
                        />
                    </AccordionPanel>
                </AccordionItem>
            </Accordion>
        </Box>
    );
}

export default TicketActivitySection;

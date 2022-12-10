import { Heading, List } from "@chakra-ui/react";
import ListItem from "../components/TicketListItem";

type ConnectedTicketsSectionProps = {
    connectedToTickets: any[]
    connectedByTickets: any[]
}

function ConnectedTicketsSection({ connectedToTickets, connectedByTickets }: ConnectedTicketsSectionProps) {

    return (
        <>
            <Heading className="text-lg">Connected to:</Heading>
            <List className="my-2 flex flex-col gap-4">
                {connectedToTickets.length > 0
                    ? connectedToTickets.map(connectedTicket => <ListItem item={connectedTicket} />)
                    : <div className="flex items-center">No connected tickets</div>
                }
            </List>
            <Heading className="text-lg">Connected by:</Heading>
            <List className="my-2 flex flex-col gap-4">
                {connectedByTickets.length > 0
                    ? connectedByTickets.map(connectedTicket => <ListItem item={connectedTicket} />)
                    : <div className="flex items-center">No connected tickets</div>
                }
            </List>
        </>
    )
}

export default ConnectedTicketsSection;
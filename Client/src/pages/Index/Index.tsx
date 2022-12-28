import { Container, Flex, Heading } from "@chakra-ui/react";
import TicketActivityList from "src/components/Lists/TicketActivity/TicketActivityList";
import { useInfiniteQuery } from "src/hooks/infiniteQuery";

interface IndexProps { }

function Index(props: IndexProps) {

  const activitiesQuery = useInfiniteQuery<any, any>(["ticketActivities"], { route: "ticketActivities" });

  return (
    <Container maxW={"container.lg"}>
      <Heading className="my-4 text-2xl" as="h1">
        Lists
      </Heading>
      <Flex className="justify-center items-center">
        <div>tickets</div>
        <div>add ticket</div>
      </Flex>
      <Heading className="my-4 text-2xl" as="h1">
        Recent activity
      </Heading>
      <TicketActivityList variant="intersection-observer" activitiesQuery={activitiesQuery} />
    </Container>
  )
}

export default Index;

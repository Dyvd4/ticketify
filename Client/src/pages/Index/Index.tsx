import { Alert, AlertIcon, Container, Flex, Heading, Text } from "@chakra-ui/react";
import Activity from "src/components/Activity/Activity";
import InfiniteQueryItems from "src/components/List/InfiniteQueryItems";
import LoadingRipple from "src/components/Loading/LoadingRipple";
import useInfiniteQuery from "src/hooks/useInfiniteQuery";

interface IndexProps { }

function Index(props: IndexProps) {

  const actvitiesQuery = useInfiniteQuery<any, any>(["ticketActivities"], { route: "ticketActivities" });

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
      <Flex className="flex-col gap-4">
        <InfiniteQueryItems
          query={actvitiesQuery}
          loadingDisplay={<LoadingRipple centered />}
          errorDisplay={
            <Alert className="rounded-md" status="error" variant="top-accent">
              <AlertIcon />
              <Text>
                There was an error processing your request
              </Text>
            </Alert>
          }>
          {activity => (
            <Activity key={activity.id} activity={activity} />
          )}
        </InfiniteQueryItems>
        <br />
      </Flex>
    </Container>
  )
}

export default Index;

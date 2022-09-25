import { Alert, AlertIcon, Container, Flex, Heading, Text } from "@chakra-ui/react";
import { useQuery } from "react-query";
import { fetchEntity } from "src/api/entity";
import Activity from "src/components/Activity/Activity";
import LoadingRipple from "src/components/Loading/LoadingRipple";

interface IndexProps { }

function Index(props: IndexProps) {

  const {
    data: { items: activities } = [],
    isLoading,
    isError
  } = useQuery(["ticketActivities"], () => {
    return fetchEntity({ route: "ticketActivities" });
  });

  if (isLoading) return <LoadingRipple centered />

  if (isError) {
    return (
      <Alert className="rounded-md" status="error" variant="top-accent">
        <AlertIcon />
        <Text>
          There was an error processing your request
        </Text>
      </Alert>
    )
  }

  return (
    <Container maxW={"container.lg"}>
      <Heading className="my-4" as="h1">
        Lists
      </Heading>
      <Flex className="justify-center items-center">
        <div>tickets</div>
        <div>add ticket</div>
      </Flex>
      <Heading className="my-4" as="h1">
        Recent activity
      </Heading>
      <Flex className="flex-col gap-4">
        {activities.map(activity => (
          <Activity key={activity.id} activity={activity} />
        ))}
      </Flex>
    </Container>
  )
}

export default Index;

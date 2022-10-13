import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Container } from "@chakra-ui/react";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import List from "src/components/List/List";
import ListItem from "src/components/List/ListItem";
import TicketListItemActions from "./TicketListItemActions";
import TicketListItemContent from "./TicketListItemContent";

interface IndexProps { }

function Index(props: IndexProps) {
  return (
    <Container>
      <Breadcrumb
        className="text-gray-700 dark:text-gray-300 font-bold mt-4"
        separator={<FontAwesomeIcon icon={faChevronRight} size="xs" />}>
        <BreadcrumbItem>
          <BreadcrumbLink href="/" isCurrentPage>
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="#" isCurrentPage>
            Tickets
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <List
        fetch={{
          route: "tickets",
          queryKey: "tickets"
        }}
        listItemRender={(item) => (
          <ListItem
            content={<TicketListItemContent item={item} />}
            actions={<TicketListItemActions item={item} />}
          />
        )}
        header={{
          title: "pending tickets",
          showCount: true
        }}
        sort={[
          {
            property: "title"
          },
          {
            property: "priority.name",
            label: "priority"
          },
          {
            property: "dueDate"
          },
        ]}
        filter={[
          {
            property: "title",
            label: "Title",
            type: "string"
          },
          {
            property: "priority.name",
            label: "priority",
            type: "string"
          }
        ]}
        add={{
          // 🥵
          route: "Ticket/Form/id="
        }}
      />
    </Container>
  )
}

export default Index;

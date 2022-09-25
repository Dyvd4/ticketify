import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Container } from "@chakra-ui/react";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import List from "src/components/List/List";
import TicketListItemActions from "./TicketListItemActions";
import TicketListItemContent from "./TicketListItemContent";
import TicketListItemFilter from "./TicketListItemFilter";
import TicketListItemSort from "./TicketListItemSort";

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
          <BreadcrumbLink href="/Ticket" isCurrentPage>
            Tickets
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <List
        fetch={{
          route: "tickets",
          queryKey: "tickets"
        }}
        listItemRender={(item) => {
          return {
            content: <TicketListItemContent item={item} />,
            actions: <TicketListItemActions item={item} />
          }
        }
        }
        header={{
          title: "pending tickets",
          showCount: true
        }}
        sort={<TicketListItemSort />}
        filter={<TicketListItemFilter />}
        add={{
          // 🥵
          route: "Ticket/Form/id="
        }}
      />
    </Container>
  )
}

export default Index;

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Container } from "@chakra-ui/react";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TicketList from "src/components/Lists/Ticket/List";

interface IndexProps { }

function Index(props: IndexProps) {

  return (
    <Container>
      <Breadcrumb
        className="font-bold mt-4"
        separator={<FontAwesomeIcon icon={faChevronRight} size="xs" />}>
        <BreadcrumbItem className="text-secondary-hover">
          <BreadcrumbLink href="/">
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem className="text-secondary-hover">
          <BreadcrumbLink href="#" isCurrentPage>
            Tickets
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <TicketList />
    </Container>
  )
}

export default Index;

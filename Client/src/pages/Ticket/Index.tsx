import { Container } from "@chakra-ui/react";
import TicketList from "src/components/Lists/Ticket/List";
import useBreadcrumb from "src/context/hooks/useBreadcrumbs";

interface IndexProps { }

function Index(props: IndexProps) {

  useBreadcrumb([
    {
      name: "Home",
      href: "/"
    },
    {
      name: "Tickets",
      href: "#",
      isCurrentPage: true
    }
  ])

  return (
    <Container>
      <TicketList />
    </Container>
  )
}

export default Index;

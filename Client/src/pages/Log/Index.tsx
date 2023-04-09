import { Container } from "@chakra-ui/react";
import useBreadcrumb from "src/context/hooks/useBreadcrumbs";
import LogList from "./components/LogList";

interface IndexProps { }

function Index(props: IndexProps) {

  useBreadcrumb([
    {
      name: "Home",
      href: "/"
    },
    {
      name: "Logs",
      href: "#",
      isCurrentPage: true
    }
  ])

  return (
    <Container>
      <LogList />
    </Container>
  )
}

export default Index;

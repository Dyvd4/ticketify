import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Container } from "@chakra-ui/react";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LogList from "./components/LogList";

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
            Logs
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <LogList />
    </Container>
  )
}

export default Index;

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Container } from "@chakra-ui/react";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import List from "src/components/List/List";
import LogListItem from "./LogListItem";

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
      <List
        fetch={{
          route: "logs",
          queryKey: "logs"
        }}
        listItemRender={(item) => <LogListItem item={item} />}
        header={{
          title: "Logs",
          showCount: true
        }}
        sort={[
          {
            property: "createdAt"
          },
          {
            property: "level",
          },
          {
            property: "message"
          },
        ]}
        filter={[
          {
            property: "message",
            type: "string"
          },
          {
            property: "errorMessage",
            label: "error message",
            type: "string"
          },
          {
            property: "errorStack",
            label: "error stack",
            type: "string"
          },
          {
            property: "level",
            type: "string"
          }
        ]}
      />
    </Container>
  )
}

export default Index;

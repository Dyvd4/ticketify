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
        className="text-secondary-hover font-bold mt-4"
        separator={<FontAwesomeIcon icon={faChevronRight} size="xs" />}>
        <BreadcrumbItem>
          <BreadcrumbLink href="/" isCurrentPage>
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
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
      />
    </Container>
  )
}

export default Index;

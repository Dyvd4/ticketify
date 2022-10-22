import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Container, VisuallyHidden } from "@chakra-ui/react";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef } from "react";
import TicketFormModal from "src/components/FormModals/Ticket";
import List from "src/components/List/List";
import ListItem from "src/components/List/ListItem";
import TicketListItemActions from "./TicketListItemActions";
import TicketListItemContent from "./TicketListItemContent";

interface IndexProps { }

function Index(props: IndexProps) {

  const addButtonRef = useRef<HTMLButtonElement | null>(null);

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
      <List
        fetch={{
          route: "tickets",
          queryKey: "ticket"
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
        onAdd={() => addButtonRef.current?.click()}
      />
      <VisuallyHidden>
        <Button ref={addButtonRef} />
      </VisuallyHidden>
      <TicketFormModal mountButtonRef={addButtonRef} />
    </Container>
  )
}

export default Index;

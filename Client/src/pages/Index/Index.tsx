import List from "src/components/List/List";
import TicketListItemActions from "./TicketListItemActions";
import TicketListItemContent from "./TicketListItemContent";
import TicketListItemFilter from "./TicketListItemFilter";
import TicketListItemSort from "./TicketListItemSort";

interface IndexProps { }

function Index(props: IndexProps) {
  return (
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
      sortInputs={<TicketListItemSort />}
      filterInputs={<TicketListItemFilter />}
    />
  )
}

export default Index;

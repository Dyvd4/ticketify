import { Container, Heading, MenuItem } from "@chakra-ui/react";
import { useState } from "react";
import List from "src/components/List/List";

interface IndexProps { }

function Index(props: IndexProps) {
  const [listItemsCount, setListItemsCount] = useState(0);
  return (
    <>
      <Heading className="text-center my-8 dark:text-gray-400">
        Pending tickets ({listItemsCount})
      </Heading>
      <Container>
        <List
          fetch={{
            route: "Tickets",
            queryKey: "Tickets",
            onResult: (listItems) => setListItemsCount(listItems.length)
          }}
          listItemRender={(item) => {
            return {
              content:
                <div className="flex gap-4">
                  <div className={`rounded-full bg-${item.color} h-8 w-8`}></div>
                  {item.title}
                </div>,
              actions: <>
                <MenuItem>Create</MenuItem>
                {item.isEditable && <>
                  <MenuItem>Edit</MenuItem>
                </>}
                {item.isDeletable && <>
                  <MenuItem>Delete</MenuItem>
                </>}
              </>
            }
          }}
        />
      </Container>
    </>
  )
}

export default Index;

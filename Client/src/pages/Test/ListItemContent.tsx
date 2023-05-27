import { Box, Checkbox, Divider, Heading, StackDivider, Tag } from "@chakra-ui/react";
import { faCheckCircle, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { format } from "date-fns";

function TestListItemContent({ item }: { item }) {
    return (
        <div>
            <div>
                <span className="text-secondary">description:</span>&nbsp;
                {item.description}
            </div>
            <div>
                <span className="text-secondary">Is Amazing</span>
                &nbsp;
                <FontAwesomeIcon icon={item.isAmazing ? faCheckCircle : faTimes} />
            </div>
            <div>
                <span className="text-secondary">created at:</span>&nbsp;
                {format(new Date(item.createdAt), "dd.MM.yy HH:mm:ss")}
            </div>
        </div>
    );
}

export default TestListItemContent;

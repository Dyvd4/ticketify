import { useState } from "react";
import FormWrapper from "../../../components/Forms/Ticket/FormWrapper";

function TicketFormIndex() {
    const [ticket, setTicket] = useState<any>();
    return <FormWrapper ticket={ticket} setTicket={setTicket} />
}

export default TicketFormIndex;
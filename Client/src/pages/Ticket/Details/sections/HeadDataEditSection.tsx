import TicketFormWrapper from "src/components/Forms/Ticket/FormWrapper";

type HeadDataEditSectionProps = {
    ticket: any
    setTicket(...args: any[]): void
    onAbort?(...args: any[]): void
    onSuccess?(...args: any[]): void
}

function HeadDataEditSection({ ticket, ...props }: HeadDataEditSectionProps) {
    return <TicketFormWrapper
        ticket={ticket}
        setTicket={props.setTicket}
        onSuccess={props.onSuccess}
        onAbort={props.onAbort}
        variant="edit"
        maxW={"full"}
    />
}

export default HeadDataEditSection;
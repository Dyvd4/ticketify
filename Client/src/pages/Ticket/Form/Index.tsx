import { Container, Heading } from "@chakra-ui/react";
import { faFireFlameCurved } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { fetchEntity } from "src/api/entity";
import LoadingRipple from "src/components/Loading/LoadingRipple";
import FormWrapper from "../../../components/Forms/Ticket/FormWrapper";

function TicketFormIndex() {
    // params
    // ------
    let { params: paramsRaw } = useParams();
    const params = new URLSearchParams(paramsRaw);
    const id = parseInt(params.get("id") || "");
    const type = id ? "edit" : "add";
    // state
    // -----
    const [ticket, setTicket] = useState<any>();

    // queries
    // -------
    const { data: fetchedTicket, status, fetchStatus } = useQuery(["ticket", id], () => {
        return fetchEntity({ route: "ticket", entityId: id!.toString() })
    }, { enabled: !!id });

    // shout out
    // https://stackoverflow.com/questions/72501651/what-state-represents-the-loading-or-data-not-fetched-yet-state-when-using-enabl
    const isLoading = status === "loading" && fetchStatus === "fetching";

    if (isLoading) return <LoadingRipple centered />

    return (
        <Container>
            <Heading as="h1" className="my-4 flex items-center gap-4 text-xl">
                Add ticket
                <FontAwesomeIcon icon={faFireFlameCurved} className="text-orange-600" />
            </Heading>
            <FormWrapper
                variant={type}
                ticket={type === "add"
                    ? ticket
                    : {
                        ...fetchedTicket,
                        ...ticket
                    }}
                setTicket={setTicket}
                onSuccess={type === "edit" ? () => window.location.href = `/Ticket/Details/${id}` : undefined}
                onAbort={() => window.location.href = "/"}
            />
        </Container>
    )
}

export default TicketFormIndex;
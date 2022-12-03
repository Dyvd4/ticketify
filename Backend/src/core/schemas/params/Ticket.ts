const mapTicket = (ticket) => {
    const {
        title,
        responsibleUserId,
        description,
        dueDate,
        priorityId,
        statusId,
    } = ticket;
    return {
        title,
        responsibleUserId,
        description,
        dueDate,
        priorityId,
        statusId
    }
}

export default mapTicket
const mapTicket = (ticket) => {
    const {
        title,
        responsibleUserId,
        description,
        dueDate,
        priorityId,
        statusId,
        createdAt,
        updatedAt,
        createUser,
        updateUser
    } = ticket;
    return {
        title,
        responsibleUserId,
        description,
        dueDate,
        priorityId,
        statusId,
        createdAt,
        updatedAt,
        createUser,
        updateUser
    }
}

export default mapTicket
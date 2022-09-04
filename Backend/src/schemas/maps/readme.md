This is used to map the entity before update,
because there might be some entities included that cannot be updated directly.

example: 
model User {
    username: string
    password: string
    attachments Attachments
}

Attachments cannot be updated here.
Map does return the properties to update.

In this case, we omit the attachments property so that it
doesn't throw an error.
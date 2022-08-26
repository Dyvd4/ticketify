import { User } from "@prisma/client";

export const mapUser = (user: User) => {
    return {
        id: user.id,
        username: user.username,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    }
}
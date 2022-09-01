import { User } from "@prisma/client";

export const mapUser = (user: User) => {
    return {
        id: user.id,
        username: user.username,
        // @ts-ignore
        avatar: user.avatar,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    }
}
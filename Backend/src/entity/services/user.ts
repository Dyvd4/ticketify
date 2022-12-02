import { User } from "@prisma/client";

export const mapUser = (user: User) => {
    return {
        id: user.id,
        username: user.username,
        email: user.email,
        emailConfirmed: user.emailConfirmed,
        // @ts-ignore
        avatar: user.avatar,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    }
}
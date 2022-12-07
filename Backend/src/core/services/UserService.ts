import { User } from "@prisma/client";

export const isHalfAuthenticated = (user: User) => !!user;
export const isAuthenticated = (user: User) => !!user && user.emailConfirmed;
export const isAuthorized = (user: User) => isAuthenticated(user);

export default {
    isHalfAuthenticated,
    isAuthenticated,
    isAuthorized
}
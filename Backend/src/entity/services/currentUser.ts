import { User } from "@prisma/client";

let currentUser: User;

/** @returns currentUser if authenticated */
export const getCurrentUser = () => currentUser;

export const setCurrentUser = (user: User) => {
    currentUser = user;
}
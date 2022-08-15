import { User } from "@prisma/client";

let currentUser: User;

export const getCurrentUser = () => currentUser;

export const setCurrentUser = (user: User) => {
    currentUser = user;
}
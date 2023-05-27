import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";

@Injectable()
export class UserService {
    private currentUser?: User;

    getCurrentUser(): User | undefined {
        return this.currentUser;
    }

    setCurrentUser(currentUser: User) {
        this.currentUser = currentUser;
    }
}

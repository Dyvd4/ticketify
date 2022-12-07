import { PrismaClient } from "@prisma/client";
import TicketActivity from "@core/middlewares/prisma/TicketActivity";
import UserSignature from "@core/middlewares/prisma/UserSignature";

const prisma = new PrismaClient();
prisma.$use(TicketActivity("Comment"));
prisma.$use(UserSignature);
export default prisma;
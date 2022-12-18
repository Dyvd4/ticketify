import { PrismaClient } from "@prisma/client";
import TicketModelActivity from "@core/middlewares/prisma/TicketActivity";
import UserSignature from "@core/middlewares/prisma/UserSignature";

const prisma = new PrismaClient();
prisma.$use(TicketModelActivity("Comment"));
prisma.$use(UserSignature);

export default prisma;
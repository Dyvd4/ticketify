import { PrismaClient } from "@prisma/client";
import ticketActivity from "@services/middlewares/prisma/ticketActivity";
import userSignature from "@services/middlewares/prisma/userSignature";

const prisma = new PrismaClient();
prisma.$use(ticketActivity("Comment"));
prisma.$use(userSignature);
export default prisma;
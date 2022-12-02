import { PrismaClient } from "@prisma/client";
import ticketActivity from "@middlewares/prisma/ticketActivity";
import userSignature from "@middlewares/prisma/userSignature";

const prisma = new PrismaClient();
prisma.$use(ticketActivity("Comment"));
prisma.$use(userSignature);
export default prisma;
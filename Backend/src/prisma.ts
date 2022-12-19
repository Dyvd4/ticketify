import { createActivityByComment, createActivityIfDescriptionHasChanged, createActivityIfResponsibleUserHasChanged, createActivityIfStatusHasChanged } from "@core/middlewares/prisma/TicketActivityMiddlewares";
import UserSignature from "@core/middlewares/prisma/UserSignature";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ticket activities
prisma.$use(createActivityByComment);
prisma.$use(createActivityIfDescriptionHasChanged);
prisma.$use(createActivityIfStatusHasChanged);
prisma.$use(createActivityIfResponsibleUserHasChanged);

// other
prisma.$use(UserSignature);

export default prisma;
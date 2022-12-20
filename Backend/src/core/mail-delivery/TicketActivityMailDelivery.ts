import config from "@config";
import MailTemplateProvider from "@lib/MailTemplateProvider";
import MailTransporter from "@lib/MailTransporter";
import prisma from "@prisma";
import jwt from "jsonwebtoken"

const { URL, SUPPORT_EMAIL, JWT_SECRET_KEY } = config;

export const sendTicketActivityEmailToWatchingUsers = async (ticketActivityId: string) => {

    const ticketActivity = (await prisma.ticketActivity.findUnique({
        where: {
            id: ticketActivityId
        }
    }))!;

    const { title, ticketId } = ticketActivity;

    const ticketWatcher = await prisma.ticketWatcher.findMany({
        where: {
            ticketId
        },
        include: {
            user: true,
            ticket: true
        }
    });

    return Promise.all(ticketWatcher.map(({ user, ticket }) => (
        (async () => {

            const encodedUserId = jwt.sign({
                data: {
                    userId: user.id
                }
            }, JWT_SECRET_KEY)

            const html = await MailTemplateProvider.getInjectedHtmlFromFile("TicketActivityTemplate", {
                URL,
                ticket,
                user,
                ticketActivity,
                encodedUserId
            });
            return MailTransporter.sendMail({
                from: SUPPORT_EMAIL,
                to: user.email!,
                subject: `New activity on ticket '#${ticket.id} ${ticket.title}' ==> ${title}`,
                html
            })
        })()
    )));
}

export default {
    sendTicketActivityEmailToWatchingUsers
}
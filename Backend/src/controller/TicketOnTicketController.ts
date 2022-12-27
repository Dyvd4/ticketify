import { authentication } from '@core/middlewares/Auth';
import TicketOnTicketSchema from '@core/schemas/TicketOnTicketSchema';
import prisma from "@prisma";
import express from 'express';

const Router = express.Router();
Router.use("/ticketOnTicket", authentication())

Router.post('/ticketOnTicket', async (req, res, next) => {
    let ticketOnTicket = req.body;
    try {
        const validation = TicketOnTicketSchema.validate(ticketOnTicket);
        if (validation.error) return res.status(400).json({ validation });
        ticketOnTicket = validation.value;

        const { connectedByTicketId, connectedToTicketId } = ticketOnTicket;

        if (connectedByTicketId === connectedToTicketId) {
            return res.status(400).json({
                validation: {
                    message: "Can't connect to own ticket"
                }
            });
        }

        const connectionExisting = await prisma.ticketOnTicket.findUnique({
            where: {
                connectedByTicketId_connectedToTicketId: {
                    connectedByTicketId,
                    connectedToTicketId
                }
            }
        });

        if (connectionExisting) {
            return res.status(400).json({
                validation: {
                    message: "Connection to that ticket already existing"
                }
            });
        }

        const newTicketOnTicket = await prisma.ticketOnTicket.create({
            data: ticketOnTicket
        });

        res.json(newTicketOnTicket);
    }
    catch (e) {
        next(e)
    }
});

Router.delete('/ticketOnTicket/:connectedByTicketId/:connectedToTicketId', async (req, res, next) => {
    const { connectedByTicketId, connectedToTicketId } = req.params;
    try {
        const deletedTicketOnTicket = await prisma.ticketOnTicket.delete({
            where: {
                connectedByTicketId_connectedToTicketId: {
                    connectedByTicketId: parseInt(connectedByTicketId),
                    connectedToTicketId: parseInt(connectedToTicketId)
                }
            }
        });
        res.json(deletedTicketOnTicket);
    }
    catch (e) {
        next(e)
    }
});

export default Router;
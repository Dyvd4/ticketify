BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[TicketOnTicket] (
    [ticketId] INT NOT NULL,
    [connectedToTicketId] INT NOT NULL,
    CONSTRAINT [TicketOnTicket_ticketId_connectedToTicketId_key] UNIQUE NONCLUSTERED ([ticketId],[connectedToTicketId])
);

-- AddForeignKey
ALTER TABLE [dbo].[TicketOnTicket] ADD CONSTRAINT [TicketOnTicket_ticketId_fkey] FOREIGN KEY ([ticketId]) REFERENCES [dbo].[Ticket]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[TicketOnTicket] ADD CONSTRAINT [TicketOnTicket_connectedToTicketId_fkey] FOREIGN KEY ([connectedToTicketId]) REFERENCES [dbo].[Ticket]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

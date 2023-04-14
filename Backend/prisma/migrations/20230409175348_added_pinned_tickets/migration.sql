BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[PinnedTicket] (
    [ticketId] INT NOT NULL,
    [userId] NVARCHAR(100) NOT NULL,
    [createdAt] DATETIME2 CONSTRAINT [PinnedTicket_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2,
    [createUser] NVARCHAR(100),
    [updateUser] NVARCHAR(100),
    CONSTRAINT [PinnedTicket_ticketId_userId_key] UNIQUE NONCLUSTERED ([ticketId],[userId])
);

-- AddForeignKey
ALTER TABLE [dbo].[PinnedTicket] ADD CONSTRAINT [PinnedTicket_ticketId_fkey] FOREIGN KEY ([ticketId]) REFERENCES [dbo].[Ticket]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[PinnedTicket] ADD CONSTRAINT [PinnedTicket_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

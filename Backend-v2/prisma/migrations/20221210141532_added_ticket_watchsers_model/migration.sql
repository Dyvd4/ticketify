BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[TicketWatchers] (
    [userId] NVARCHAR(100) NOT NULL,
    [ticketId] INT NOT NULL,
    [createdAt] DATETIME2 CONSTRAINT [TicketWatchers_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2,
    [createUser] NVARCHAR(100),
    [updateUser] NVARCHAR(100),
    CONSTRAINT [TicketWatchers_pkey] PRIMARY KEY CLUSTERED ([userId],[ticketId])
);

-- AddForeignKey
ALTER TABLE [dbo].[TicketWatchers] ADD CONSTRAINT [TicketWatchers_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[TicketWatchers] ADD CONSTRAINT [TicketWatchers_ticketId_fkey] FOREIGN KEY ([ticketId]) REFERENCES [dbo].[Ticket]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

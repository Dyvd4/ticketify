/*
  Warnings:

  - You are about to drop the `TicketWatchers` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[TicketWatchers] DROP CONSTRAINT [TicketWatchers_ticketId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[TicketWatchers] DROP CONSTRAINT [TicketWatchers_userId_fkey];

-- DropTable
DROP TABLE [dbo].[TicketWatchers];

-- CreateTable
CREATE TABLE [dbo].[TicketWatcher] (
    [userId] NVARCHAR(100) NOT NULL,
    [ticketId] INT NOT NULL,
    [createdAt] DATETIME2 CONSTRAINT [TicketWatcher_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2,
    [createUser] NVARCHAR(100),
    [updateUser] NVARCHAR(100),
    CONSTRAINT [TicketWatcher_pkey] PRIMARY KEY CLUSTERED ([userId],[ticketId])
);

-- AddForeignKey
ALTER TABLE [dbo].[TicketWatcher] ADD CONSTRAINT [TicketWatcher_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[TicketWatcher] ADD CONSTRAINT [TicketWatcher_ticketId_fkey] FOREIGN KEY ([ticketId]) REFERENCES [dbo].[Ticket]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

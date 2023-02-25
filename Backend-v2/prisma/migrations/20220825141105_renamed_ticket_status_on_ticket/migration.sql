/*
  Warnings:

  - You are about to drop the column `ticketStatusId` on the `Ticket` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Ticket] DROP CONSTRAINT [Ticket_ticketStatusId_fkey];

-- AlterTable
ALTER TABLE [dbo].[Ticket] DROP COLUMN [ticketStatusId];
ALTER TABLE [dbo].[Ticket] ADD [statusId] NVARCHAR(100);

-- AddForeignKey
ALTER TABLE [dbo].[Ticket] ADD CONSTRAINT [Ticket_statusId_fkey] FOREIGN KEY ([statusId]) REFERENCES [dbo].[TicketStatus]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

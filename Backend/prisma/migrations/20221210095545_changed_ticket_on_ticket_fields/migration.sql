/*
  Warnings:

  - You are about to drop the column `ticketId` on the `TicketOnTicket` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[connectedByTicketId,connectedToTicketId]` on the table `TicketOnTicket` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `connectedByTicketId` to the `TicketOnTicket` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[TicketOnTicket] DROP CONSTRAINT [TicketOnTicket_ticketId_fkey];

-- DropIndex
ALTER TABLE [dbo].[TicketOnTicket] DROP CONSTRAINT [TicketOnTicket_ticketId_connectedToTicketId_key];

-- AlterTable
ALTER TABLE [dbo].[TicketOnTicket] DROP COLUMN [ticketId];
ALTER TABLE [dbo].[TicketOnTicket] ADD [connectedByTicketId] INT NOT NULL;

-- CreateIndex
ALTER TABLE [dbo].[TicketOnTicket] ADD CONSTRAINT [TicketOnTicket_connectedByTicketId_connectedToTicketId_key] UNIQUE NONCLUSTERED ([connectedByTicketId], [connectedToTicketId]);

-- AddForeignKey
ALTER TABLE [dbo].[TicketOnTicket] ADD CONSTRAINT [TicketOnTicket_connectedByTicketId_fkey] FOREIGN KEY ([connectedByTicketId]) REFERENCES [dbo].[Ticket]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

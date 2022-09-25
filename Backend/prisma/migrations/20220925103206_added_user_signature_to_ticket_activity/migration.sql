/*
  Warnings:

  - Added the required column `createdFromId` to the `TicketActivity` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[TicketActivity] DROP CONSTRAINT [TicketActivity_ticketId_fkey];

-- AlterTable
ALTER TABLE [dbo].[TicketActivity] ADD [createUser] NVARCHAR(100),
[createdAt] DATETIME2 CONSTRAINT [TicketActivity_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
[createdFromId] NVARCHAR(100) NOT NULL,
[updateUser] NVARCHAR(100),
[updatedAt] DATETIME2;

-- AddForeignKey
ALTER TABLE [dbo].[TicketActivity] ADD CONSTRAINT [TicketActivity_ticketId_fkey] FOREIGN KEY ([ticketId]) REFERENCES [dbo].[Ticket]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[TicketActivity] ADD CONSTRAINT [TicketActivity_createdFromId_fkey] FOREIGN KEY ([createdFromId]) REFERENCES [dbo].[User]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

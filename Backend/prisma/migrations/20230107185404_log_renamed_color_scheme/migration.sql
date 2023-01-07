/*
  Warnings:

  - You are about to drop the column `colorScheme` on the `Log` table. All the data in the column will be lost.
  - Made the column `statusId` on table `Ticket` required. This step will fail if there are existing NULL values in that column.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Ticket] DROP CONSTRAINT [Ticket_statusId_fkey];

-- AlterTable
ALTER TABLE [dbo].[Log] DROP COLUMN [colorScheme];
ALTER TABLE [dbo].[Log] ADD [color] NVARCHAR(50);

-- AlterTable
ALTER TABLE [dbo].[Ticket] ALTER COLUMN [statusId] NVARCHAR(100) NOT NULL;

-- AddForeignKey
ALTER TABLE [dbo].[Ticket] ADD CONSTRAINT [Ticket_statusId_fkey] FOREIGN KEY ([statusId]) REFERENCES [dbo].[TicketStatus]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

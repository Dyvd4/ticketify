/*
  Warnings:

  - You are about to drop the column `statusId` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the `TicketStatus` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `priorityId` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Ticket] DROP CONSTRAINT [Ticket_statusId_fkey];

-- AlterTable
ALTER TABLE [dbo].[Ticket] DROP COLUMN [statusId];
ALTER TABLE [dbo].[Ticket] ADD [priorityId] NVARCHAR(100) NOT NULL;

-- DropTable
DROP TABLE [dbo].[TicketStatus];

-- CreateTable
CREATE TABLE [dbo].[TicketProprity] (
    [id] NVARCHAR(100) NOT NULL,
    [color] NVARCHAR(50) NOT NULL,
    [name] NVARCHAR(50) NOT NULL,
    [createdAt] DATETIME2 CONSTRAINT [TicketProprity_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2,
    [createUser] NVARCHAR(100),
    [updateUser] NVARCHAR(100),
    CONSTRAINT [TicketProprity_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Ticket] ADD CONSTRAINT [Ticket_priorityId_fkey] FOREIGN KEY ([priorityId]) REFERENCES [dbo].[TicketProprity]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

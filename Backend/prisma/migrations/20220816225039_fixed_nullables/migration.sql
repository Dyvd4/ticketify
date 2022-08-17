/*
  Warnings:

  - You are about to drop the `TicketProprity` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Ticket] DROP CONSTRAINT [Ticket_priorityId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Ticket] DROP CONSTRAINT [Ticket_responsibleUserId_fkey];

-- AlterTable
ALTER TABLE [dbo].[Ticket] ALTER COLUMN [responsibleUserId] NVARCHAR(100) NULL;
ALTER TABLE [dbo].[Ticket] ALTER COLUMN [dueDate] DATETIME NULL;

-- DropTable
DROP TABLE [dbo].[TicketProprity];

-- CreateTable
CREATE TABLE [dbo].[TicketPriority] (
    [id] NVARCHAR(100) NOT NULL,
    [color] NVARCHAR(50) NOT NULL,
    [name] NVARCHAR(50) NOT NULL,
    [createdAt] DATETIME2 CONSTRAINT [TicketPriority_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2,
    [createUser] NVARCHAR(100),
    [updateUser] NVARCHAR(100),
    CONSTRAINT [TicketPriority_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Ticket] ADD CONSTRAINT [Ticket_responsibleUserId_fkey] FOREIGN KEY ([responsibleUserId]) REFERENCES [dbo].[User]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Ticket] ADD CONSTRAINT [Ticket_priorityId_fkey] FOREIGN KEY ([priorityId]) REFERENCES [dbo].[TicketPriority]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

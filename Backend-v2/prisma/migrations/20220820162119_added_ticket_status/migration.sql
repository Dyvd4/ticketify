BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Ticket] ADD [ticketStatusId] NVARCHAR(100);

-- CreateTable
CREATE TABLE [dbo].[TicketStatus] (
    [id] NVARCHAR(100) NOT NULL,
    [color] NVARCHAR(50) NOT NULL,
    [name] NVARCHAR(50) NOT NULL,
    [createdAt] DATETIME2 CONSTRAINT [TicketStatus_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2,
    [createUser] NVARCHAR(100),
    [updateUser] NVARCHAR(100),
    CONSTRAINT [TicketStatus_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Ticket] ADD CONSTRAINT [Ticket_ticketStatusId_fkey] FOREIGN KEY ([ticketStatusId]) REFERENCES [dbo].[TicketStatus]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

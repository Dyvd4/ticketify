BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[FileOnTicket] ADD [createUser] NVARCHAR(100),
[createdAt] DATETIME2 CONSTRAINT [FileOnTicket_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
[updateUser] NVARCHAR(100),
[updatedAt] DATETIME2;

-- AlterTable
ALTER TABLE [dbo].[FileOnUser] ADD [createUser] NVARCHAR(100),
[createdAt] DATETIME2 CONSTRAINT [FileOnUser_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
[updateUser] NVARCHAR(100),
[updatedAt] DATETIME2;

-- AlterTable
ALTER TABLE [dbo].[Test] ALTER COLUMN [createdAt] DATETIME2 NULL;
ALTER TABLE [dbo].[Test] ADD [createUser] NVARCHAR(100),
[updateUser] NVARCHAR(100),
[updatedAt] DATETIME2;

-- AlterTable
ALTER TABLE [dbo].[TicketOnTicket] ADD [createUser] NVARCHAR(100),
[createdAt] DATETIME2 CONSTRAINT [TicketOnTicket_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
[updateUser] NVARCHAR(100),
[updatedAt] DATETIME2;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

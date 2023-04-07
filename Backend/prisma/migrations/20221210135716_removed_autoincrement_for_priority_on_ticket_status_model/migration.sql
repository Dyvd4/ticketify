BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Ticket] DROP CONSTRAINT [Ticket_statusId_fkey];

-- RedefineTables
BEGIN TRANSACTION;
DECLARE @SQL NVARCHAR(MAX) = N''
SELECT @SQL += N'ALTER TABLE '
    + QUOTENAME(OBJECT_SCHEMA_NAME(PARENT_OBJECT_ID))
    + '.'
    + QUOTENAME(OBJECT_NAME(PARENT_OBJECT_ID))
    + ' DROP CONSTRAINT '
    + OBJECT_NAME(OBJECT_ID) + ';'
FROM SYS.OBJECTS
WHERE TYPE_DESC LIKE '%CONSTRAINT'
    AND OBJECT_NAME(PARENT_OBJECT_ID) = 'TicketStatus'
    AND SCHEMA_NAME(SCHEMA_ID) = 'dbo'
EXEC sp_executesql @SQL
;
CREATE TABLE [dbo].[_prisma_new_TicketStatus] (
    [id] NVARCHAR(100) NOT NULL,
    [color] NVARCHAR(50) NOT NULL,
    [name] NVARCHAR(50) NOT NULL,
    [priority] INT CONSTRAINT [TicketStatus_priority_df] DEFAULT 0,
    [createdAt] DATETIME2 CONSTRAINT [TicketStatus_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2,
    [createUser] NVARCHAR(100),
    [updateUser] NVARCHAR(100),
    CONSTRAINT [TicketStatus_pkey] PRIMARY KEY CLUSTERED ([id])
);
IF EXISTS(SELECT * FROM [dbo].[TicketStatus])
    EXEC('INSERT INTO [dbo].[_prisma_new_TicketStatus] ([color],[createUser],[createdAt],[id],[name],[priority],[updateUser],[updatedAt]) SELECT [color],[createUser],[createdAt],[id],[name],[priority],[updateUser],[updatedAt] FROM [dbo].[TicketStatus] WITH (holdlock tablockx)');
DROP TABLE [dbo].[TicketStatus];
EXEC SP_RENAME N'dbo._prisma_new_TicketStatus', N'TicketStatus';
COMMIT;

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

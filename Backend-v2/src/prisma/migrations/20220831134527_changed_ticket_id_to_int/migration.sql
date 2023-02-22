/*
  Warnings:

  - The primary key for the `FileOnTicket` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `ticketId` on the `FileOnTicket` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(100)` to `Int`.
  - The primary key for the `Ticket` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Ticket` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[FileOnTicket] DROP CONSTRAINT [FileOnTicket_ticketId_fkey];

-- AlterTable
ALTER TABLE [dbo].[FileOnTicket] DROP CONSTRAINT [FileOnTicket_pkey];
ALTER TABLE [dbo].[FileOnTicket] ALTER COLUMN [ticketId] INT NOT NULL;
ALTER TABLE [dbo].[FileOnTicket] ADD CONSTRAINT FileOnTicket_pkey PRIMARY KEY CLUSTERED ([fileId],[ticketId]);

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
    AND OBJECT_NAME(PARENT_OBJECT_ID) = 'Ticket'
    AND SCHEMA_NAME(SCHEMA_ID) = 'dbo'
EXEC sp_executesql @SQL
;
CREATE TABLE [dbo].[_prisma_new_Ticket] (
    [id] INT NOT NULL IDENTITY(1,1),
    [title] NVARCHAR(100) NOT NULL,
    [responsibleUserId] NVARCHAR(100),
    [description] NVARCHAR(max) NOT NULL,
    [dueDate] DATETIME,
    [priorityId] NVARCHAR(100) NOT NULL,
    [createdAt] DATETIME2 CONSTRAINT [Ticket_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2,
    [createUser] NVARCHAR(100),
    [updateUser] NVARCHAR(100),
    [statusId] NVARCHAR(100),
    CONSTRAINT [Ticket_pkey] PRIMARY KEY CLUSTERED ([id])
);
SET IDENTITY_INSERT [dbo].[_prisma_new_Ticket] ON;
IF EXISTS(SELECT * FROM [dbo].[Ticket])
    EXEC('INSERT INTO [dbo].[_prisma_new_Ticket] ([createUser],[createdAt],[description],[dueDate],[id],[priorityId],[responsibleUserId],[statusId],[title],[updateUser],[updatedAt]) SELECT [createUser],[createdAt],[description],[dueDate],[id],[priorityId],[responsibleUserId],[statusId],[title],[updateUser],[updatedAt] FROM [dbo].[Ticket] WITH (holdlock tablockx)');
SET IDENTITY_INSERT [dbo].[_prisma_new_Ticket] OFF;
DROP TABLE [dbo].[Ticket];
EXEC SP_RENAME N'dbo._prisma_new_Ticket', N'Ticket';
COMMIT;

-- AddForeignKey
ALTER TABLE [dbo].[FileOnTicket] ADD CONSTRAINT [FileOnTicket_ticketId_fkey] FOREIGN KEY ([ticketId]) REFERENCES [dbo].[Ticket]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

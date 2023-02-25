/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `User` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(1000)` to `NVarChar(100)`.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[User] DROP CONSTRAINT [User_pkey];
ALTER TABLE [dbo].[User] ALTER COLUMN [id] NVARCHAR(100) NOT NULL;
ALTER TABLE [dbo].[User] ADD CONSTRAINT User_pkey PRIMARY KEY CLUSTERED ([id]);

-- CreateTable
CREATE TABLE [dbo].[Ticket] (
    [id] NVARCHAR(100) NOT NULL,
    [responsibleUserId] NVARCHAR(100) NOT NULL,
    [description] NVARCHAR(max) NOT NULL,
    [dueDate] DATETIME NOT NULL,
    [statusId] NVARCHAR(100) NOT NULL,
    [createdAt] DATETIME2 CONSTRAINT [Ticket_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2,
    [createUser] NVARCHAR(100),
    [updateUser] NVARCHAR(100),
    CONSTRAINT [Ticket_pkey] PRIMARY KEY CLUSTERED ([id])
);

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

-- CreateTable
CREATE TABLE [dbo].[Comment] (
    [id] NVARCHAR(100) NOT NULL,
    [content] NVARCHAR(255) NOT NULL,
    [createdAt] DATETIME2 CONSTRAINT [Comment_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2,
    [createUser] NVARCHAR(100),
    [updateUser] NVARCHAR(100),
    CONSTRAINT [Comment_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[TicketDueDate] (
    [durationInMinutes] INT NOT NULL,
    [color] NVARCHAR(50) NOT NULL,
    CONSTRAINT [TicketDueDate_durationInMinutes_key] UNIQUE NONCLUSTERED ([durationInMinutes])
);

-- AddForeignKey
ALTER TABLE [dbo].[Ticket] ADD CONSTRAINT [Ticket_responsibleUserId_fkey] FOREIGN KEY ([responsibleUserId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

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

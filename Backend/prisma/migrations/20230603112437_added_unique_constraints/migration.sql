/*
  Warnings:

  - You are about to drop the `Role` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `TicketPriority` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `TicketStatus` will be added. If there are existing duplicate values, this will fail.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[User] DROP CONSTRAINT [User_roleId_fkey];

-- DropTable
DROP TABLE [dbo].[Role];

-- CreateTable
CREATE TABLE [dbo].[UserRole] (
    [id] NVARCHAR(100) NOT NULL,
    [name] NVARCHAR(100) NOT NULL,
    [color] NVARCHAR(50) NOT NULL,
    CONSTRAINT [UserRole_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [UserRole_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateIndex
ALTER TABLE [dbo].[TicketPriority] ADD CONSTRAINT [TicketPriority_name_key] UNIQUE NONCLUSTERED ([name]);

-- CreateIndex
ALTER TABLE [dbo].[TicketStatus] ADD CONSTRAINT [TicketStatus_name_key] UNIQUE NONCLUSTERED ([name]);

-- AddForeignKey
ALTER TABLE [dbo].[User] ADD CONSTRAINT [User_roleId_fkey] FOREIGN KEY ([roleId]) REFERENCES [dbo].[UserRole]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

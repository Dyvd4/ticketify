/*
  Warnings:

  - You are about to drop the `UserOnRole` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[UserOnRole] DROP CONSTRAINT [UserOnRole_roleId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[UserOnRole] DROP CONSTRAINT [UserOnRole_userId_fkey];

-- AlterTable
ALTER TABLE [dbo].[User] ADD [roleId] NVARCHAR(100);

-- DropTable
DROP TABLE [dbo].[UserOnRole];

-- AddForeignKey
ALTER TABLE [dbo].[User] ADD CONSTRAINT [User_roleId_fkey] FOREIGN KEY ([roleId]) REFERENCES [dbo].[Role]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

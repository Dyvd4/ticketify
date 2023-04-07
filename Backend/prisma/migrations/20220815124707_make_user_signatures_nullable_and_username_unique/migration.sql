/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[User] ALTER COLUMN [createdAt] DATETIME2 NULL;
ALTER TABLE [dbo].[User] ALTER COLUMN [updatedAt] DATETIME2 NULL;
ALTER TABLE [dbo].[User] ALTER COLUMN [createUser] NVARCHAR(100) NULL;
ALTER TABLE [dbo].[User] ALTER COLUMN [updateUser] NVARCHAR(100) NULL;

-- CreateIndex
ALTER TABLE [dbo].[User] ADD CONSTRAINT [User_username_key] UNIQUE NONCLUSTERED ([username]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

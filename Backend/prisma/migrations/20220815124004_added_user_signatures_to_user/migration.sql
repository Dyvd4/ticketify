/*
  Warnings:

  - Added the required column `createUser` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updateUser` to the `User` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[User] ADD [createUser] NVARCHAR(100) NOT NULL,
[updateUser] NVARCHAR(100) NOT NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

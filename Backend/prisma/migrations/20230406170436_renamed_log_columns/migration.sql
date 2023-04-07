/*
  Warnings:

  - You are about to drop the column `errorMessage` on the `Log` table. All the data in the column will be lost.
  - You are about to drop the column `errorStack` on the `Log` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Log] DROP COLUMN [errorMessage],
[errorStack];
ALTER TABLE [dbo].[Log] ADD [context] NVARCHAR(max),
[stack] NVARCHAR(max);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

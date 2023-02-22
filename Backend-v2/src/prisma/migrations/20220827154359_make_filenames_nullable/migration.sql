/*
  Warnings:

  - You are about to drop the column `originalFilename` on the `File` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[File] ALTER COLUMN [fileName] NVARCHAR(100) NULL;
ALTER TABLE [dbo].[File] DROP COLUMN [originalFilename];
ALTER TABLE [dbo].[File] ADD [originalFileName] NVARCHAR(100);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

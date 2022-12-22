/*
  Warnings:

  - Made the column `fileName` on table `File` required. This step will fail if there are existing NULL values in that column.
  - Made the column `originalFileName` on table `File` required. This step will fail if there are existing NULL values in that column.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[File] ALTER COLUMN [fileName] NVARCHAR(100) NOT NULL;
ALTER TABLE [dbo].[File] ALTER COLUMN [originalFileName] NVARCHAR(100) NOT NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

/*
  Warnings:

  - You are about to drop the column `color` on the `Log` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Log] DROP COLUMN [color];
ALTER TABLE [dbo].[Log] ADD [colorScheme] NVARCHAR(50);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

/*
  Warnings:

  - You are about to drop the column `action` on the `TicketActivity` table. All the data in the column will be lost.
  - You are about to drop the column `entityName` on the `TicketActivity` table. All the data in the column will be lost.
  - Added the required column `title` to the `TicketActivity` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[TicketActivity] DROP COLUMN [action],
[entityName];
ALTER TABLE [dbo].[TicketActivity] ADD [title] NVARCHAR(1000) NOT NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

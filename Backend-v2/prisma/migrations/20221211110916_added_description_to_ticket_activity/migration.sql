BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[TicketActivity] ADD [description] NVARCHAR(1000);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

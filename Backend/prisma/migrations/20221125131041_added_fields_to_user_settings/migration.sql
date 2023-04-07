BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[UserSettings] ADD [allowFilterItemsByLocalStorage] BIT NOT NULL CONSTRAINT [UserSettings_allowFilterItemsByLocalStorage_df] DEFAULT 0,
[allowSortItemsByLocalStorage] BIT NOT NULL CONSTRAINT [UserSettings_allowSortItemsByLocalStorage_df] DEFAULT 0;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

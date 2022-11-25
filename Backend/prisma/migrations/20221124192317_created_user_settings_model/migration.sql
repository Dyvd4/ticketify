BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[UserSettings] (
    [id] NVARCHAR(100) NOT NULL,
    [userId] NVARCHAR(100) NOT NULL,
    [allowSortItemsByUrl] BIT NOT NULL CONSTRAINT [UserSettings_allowSortItemsByUrl_df] DEFAULT 0,
    [allowFilterItemsByUrl] BIT NOT NULL CONSTRAINT [UserSettings_allowFilterItemsByUrl_df] DEFAULT 0,
    CONSTRAINT [UserSettings_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [UserSettings_userId_key] UNIQUE NONCLUSTERED ([userId])
);

-- AddForeignKey
ALTER TABLE [dbo].[UserSettings] ADD CONSTRAINT [UserSettings_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

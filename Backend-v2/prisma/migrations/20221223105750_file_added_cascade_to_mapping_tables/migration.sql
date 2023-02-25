BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[FileOnTicket] DROP CONSTRAINT [FileOnTicket_fileId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[FileOnUser] DROP CONSTRAINT [FileOnUser_fileId_fkey];

-- AddForeignKey
ALTER TABLE [dbo].[FileOnTicket] ADD CONSTRAINT [FileOnTicket_fileId_fkey] FOREIGN KEY ([fileId]) REFERENCES [dbo].[File]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[FileOnUser] ADD CONSTRAINT [FileOnUser_fileId_fkey] FOREIGN KEY ([fileId]) REFERENCES [dbo].[File]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

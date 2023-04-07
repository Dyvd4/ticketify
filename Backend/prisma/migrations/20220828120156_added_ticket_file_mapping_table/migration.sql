BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[FileOnTicket] (
    [fileId] NVARCHAR(100) NOT NULL,
    [ticketId] NVARCHAR(100) NOT NULL,
    CONSTRAINT [FileOnTicket_pkey] PRIMARY KEY CLUSTERED ([fileId],[ticketId])
);

-- AddForeignKey
ALTER TABLE [dbo].[FileOnTicket] ADD CONSTRAINT [FileOnTicket_fileId_fkey] FOREIGN KEY ([fileId]) REFERENCES [dbo].[File]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[FileOnTicket] ADD CONSTRAINT [FileOnTicket_ticketId_fkey] FOREIGN KEY ([ticketId]) REFERENCES [dbo].[Ticket]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[FileOnUser] (
    [fileId] NVARCHAR(100) NOT NULL,
    [userId] NVARCHAR(100) NOT NULL,
    CONSTRAINT [FileOnUser_pkey] PRIMARY KEY CLUSTERED ([fileId],[userId]),
    CONSTRAINT [FileOnUser_userId_key] UNIQUE NONCLUSTERED ([userId])
);

-- AddForeignKey
ALTER TABLE [dbo].[Ticket] ADD CONSTRAINT [Ticket_responsibleUserId_fkey] FOREIGN KEY ([responsibleUserId]) REFERENCES [dbo].[User]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Ticket] ADD CONSTRAINT [Ticket_priorityId_fkey] FOREIGN KEY ([priorityId]) REFERENCES [dbo].[TicketPriority]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Ticket] ADD CONSTRAINT [Ticket_statusId_fkey] FOREIGN KEY ([statusId]) REFERENCES [dbo].[TicketStatus]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[FileOnUser] ADD CONSTRAINT [FileOnUser_fileId_fkey] FOREIGN KEY ([fileId]) REFERENCES [dbo].[File]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[FileOnUser] ADD CONSTRAINT [FileOnUser_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[TicketActivity] (
    [id] NVARCHAR(100) NOT NULL,
    [ticketId] INT NOT NULL,
    [entityName] NVARCHAR(100) NOT NULL,
    [action] NVARCHAR(100) NOT NULL,
    [icon] NVARCHAR(100),
    [color] NVARCHAR(100),
    CONSTRAINT [TicketActivity_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[TicketActivity] ADD CONSTRAINT [TicketActivity_ticketId_fkey] FOREIGN KEY ([ticketId]) REFERENCES [dbo].[Ticket]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

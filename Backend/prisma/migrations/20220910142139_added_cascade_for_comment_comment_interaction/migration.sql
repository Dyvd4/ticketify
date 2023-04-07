BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[CommentInteraction] DROP CONSTRAINT [CommentInteraction_commentId_fkey];

-- AddForeignKey
ALTER TABLE [dbo].[CommentInteraction] ADD CONSTRAINT [CommentInteraction_commentId_fkey] FOREIGN KEY ([commentId]) REFERENCES [dbo].[Comment]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

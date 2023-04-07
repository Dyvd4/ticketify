/*
  Warnings:

  - A unique constraint covering the columns `[type,createdFromId,commentId]` on the table `CommentInteraction` will be added. If there are existing duplicate values, this will fail.

*/
BEGIN TRY

BEGIN TRAN;

-- CreateIndex
ALTER TABLE [dbo].[CommentInteraction] ADD CONSTRAINT [CommentInteraction_type_createdFromId_commentId_key] UNIQUE NONCLUSTERED ([type], [createdFromId], [commentId]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

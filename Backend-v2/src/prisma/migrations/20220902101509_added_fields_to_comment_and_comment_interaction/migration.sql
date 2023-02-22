/*
  Warnings:

  - Added the required column `authorId` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Comment] ALTER COLUMN [content] NVARCHAR(1000) NOT NULL;
ALTER TABLE [dbo].[Comment] ADD [authorId] NVARCHAR(100) NOT NULL,
[parentId] NVARCHAR(100);

-- CreateTable
CREATE TABLE [dbo].[CommentInteraction] (
    [id] NVARCHAR(100) NOT NULL,
    [type] NVARCHAR(100) NOT NULL,
    [createdFromId] NVARCHAR(100) NOT NULL,
    [commentId] NVARCHAR(100) NOT NULL,
    [createdAt] DATETIME2 CONSTRAINT [CommentInteraction_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2,
    [createUser] NVARCHAR(100),
    [updateUser] NVARCHAR(100),
    CONSTRAINT [CommentInteraction_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Comment] ADD CONSTRAINT [Comment_authorId_fkey] FOREIGN KEY ([authorId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Comment] ADD CONSTRAINT [Comment_parentId_fkey] FOREIGN KEY ([parentId]) REFERENCES [dbo].[Comment]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[CommentInteraction] ADD CONSTRAINT [CommentInteraction_createdFromId_fkey] FOREIGN KEY ([createdFromId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[CommentInteraction] ADD CONSTRAINT [CommentInteraction_commentId_fkey] FOREIGN KEY ([commentId]) REFERENCES [dbo].[Comment]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

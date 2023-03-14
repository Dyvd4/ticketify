BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Log] (
    [id] NVARCHAR(100) NOT NULL,
    [createdAt] DATETIME2 CONSTRAINT [Log_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2,
    [createUser] NVARCHAR(100),
    [updateUser] NVARCHAR(100),
    [level] NVARCHAR(20) NOT NULL,
    [message] NVARCHAR(255) NOT NULL,
    [errorMessage] NVARCHAR(max),
    [errorStack] NVARCHAR(max),
    CONSTRAINT [Log_pkey] PRIMARY KEY CLUSTERED ([id])
);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

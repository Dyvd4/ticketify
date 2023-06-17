BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[User] ADD [companyId] NVARCHAR(100);

-- CreateTable
CREATE TABLE [dbo].[FileOnCompany] (
    [fileId] NVARCHAR(100) NOT NULL,
    [companyId] NVARCHAR(100) NOT NULL,
    [createdAt] DATETIME2 CONSTRAINT [FileOnCompany_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2,
    [createUser] NVARCHAR(100),
    [updateUser] NVARCHAR(100),
    CONSTRAINT [FileOnCompany_pkey] PRIMARY KEY CLUSTERED ([fileId],[companyId]),
    CONSTRAINT [FileOnCompany_companyId_key] UNIQUE NONCLUSTERED ([companyId])
);

-- CreateTable
CREATE TABLE [dbo].[Company] (
    [id] NVARCHAR(100) NOT NULL,
    [name] NVARCHAR(100) NOT NULL,
    [createdAt] DATETIME2 CONSTRAINT [Company_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2,
    [createUser] NVARCHAR(100),
    [updateUser] NVARCHAR(100),
    CONSTRAINT [Company_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[User] ADD CONSTRAINT [User_companyId_fkey] FOREIGN KEY ([companyId]) REFERENCES [dbo].[Company]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[FileOnCompany] ADD CONSTRAINT [FileOnCompany_fileId_fkey] FOREIGN KEY ([fileId]) REFERENCES [dbo].[File]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[FileOnCompany] ADD CONSTRAINT [FileOnCompany_companyId_fkey] FOREIGN KEY ([companyId]) REFERENCES [dbo].[Company]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

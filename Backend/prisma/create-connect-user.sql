declare @sql Nvarchar(max)
declare @connect_username nvarchar(100)
set @connect_username = 'ticketify_connect_user'

IF NOT EXISTS (
	SELECT top 1 * FROM sys.server_principals 
	WHERE name = @connect_username AND type_desc = 'SQL_LOGIN'
)
	set @sql = 'create login ' + QUOTENAME(@connect_username) + 'WITH PASSWORD = ''<yourStringPassword>''
		, CHECK_EXPIRATION = ON
		, CHECK_POLICY = ON;'
	exec sp_executesql @sql

use [Ticketify]

if not exists (
	select top 1 * from sys.database_principals
	where [name] = @connect_username and type_desc = 'SQL_USER'
)
	set @sql = 'create USER ' + QUOTENAME(@connect_username) + ' ' +
		'for LOGIN ' + QUOTENAME(@connect_username) + ' ' +
		'Alter Role db_owner ' + 
		'Add MEMBER ' + QUOTENAME(@connect_username)
	exec sp_executesql @sql


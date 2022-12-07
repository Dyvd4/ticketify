# General

## Folder structure
The folder structure tries to follow the clean architecture. We have the following folders:
##### controller
All controllers.

Concerning the clean architecture, the controller shouldn't have access to the entities but has in this project sometimes.
With sometimes, I mean just the basic CRUD-operations.
The reason for this is that I don't want to extract EVERY CRUD-operation into services because that't too trivial in my opinion.

##### core 
All entity related stuff.
Entities. Services. Maps.
##### lib 
All other modules that aren't related to the entities.

## Naming conventions
Folders - kebap-case
Files - pascal-case
TS - normal js/ts naming convention --> camelCase

Also good to mention that files should be named like the module you would import.

Bad: **services/File.ts**
Good: **services/FileService.ts**

This allows better accessibility and it is more explicit.
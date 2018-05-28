# Umbraco version 8 mini-site

## Summary

This is a single page application (currently) built using the latest and greatest Umbraco version 8, installed via nuget.

## Architecture

- Umbraco is installed using Nuget
- There is only one project - the web application itself
- The database needs to be installed separately
- ModelsBuilder is used in PureLive mode

## Setup

1) Ensure you have installed version 4.7.2 of the .NET framework 
2) Open in Visual Studio 2017. NB this needs to be version 15.7.2 or above at time of writing, if not update via the Visual Studio Installer
3) Get a copy of the latest v8 SQL database and update to include your preferred SQL user (tested on SQL Server Express 2016)
4) Update the web.config connection string to use the correct SQL database (contact repo owner)
5) Rebuild the website in Visual Studio
6) Run via IIS Express or create a new website in IIS, depending on preferences
7) Login to Umbraco (contact repo owner or reset password using email with required SMTP settings)
8) There is a Trello board of items to complete (contact repo owner for access)

## Current Known Issues

The first time you run the site, the models are built using "PureLive" mode, and placed in App_Data/Models folder. Often there is a models.err file appears on first run. If this happens, currently:

- Delete this file
- Tap the web.config
- Refresh the site
- Your models should reappear and you can run as expected

# Northcoders News API



## Description

Northcoders News API is a portfolio project created during a skills bootcamp. This project serves as a backend for a news website, providing endpoints to manage articles, comments, users, and topics.


## Hosted Version

You can find the hosted version of this project here: https://nc-news-mwo0.onrender.com/api



## Installation

Clone the repository.
Ensure that you have cloned down the repo first.

You will need to make your own public repo so that you can share this project as part of your portfolio by doing the following:

Create a new public GitHub repository. Do not initialise the project with a readme, .gitignore or license.

From your cloned local version of this project you'll want to push your code to your new repository using the following commands:

git remote set-url origin YOUR_NEW_REPO_URL_HERE
git branch -M main
git push -u origin main

You will need to run npm install at this point.

## Setup Instructions

To run this project locally on yopur machine, you will need to set up environment variables for the databases. Create the following files in the root of the project:

### .env.test
### .env.development

Into each, add PGDATABASE=, with the correct database name for that environment (see /db/setup.sql for the database names). Double check that these .env files are .gitignored. That means make sure that these `.env` files are not tracked by git by having `.env.*` in your `.gitignore`.

## Create the databases and seed them

npm run setup-dbs
npm run seed

## Run Tests

npm test


## Minimum Requirements

Node.js: v14.0.0 or higher
PostgreSQL: v12.0 or higher








--- 

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)

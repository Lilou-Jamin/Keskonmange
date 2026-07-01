# Docker Compose

The Docker Compose file in this repository will setup the database and the backend.  
It is intended to be used when deploying or when testing the deployment.

## Setup

- Copy `.env.compose.example` to `.env.compose`
- Edit the environment variables
- Run `docker compose --env-file .env.compose up`
- Run `docker compose --env-file .env.compose down` to stop the app

# Prettier / ESLint pre-commit hook

There is a pre-commit hook in the .hooks directory that will run ESLint and prettier on both the backend and frontend for only the staged files.

Run this to setup the pre-commit hooks with the correct path: `git config core.hooksPath .hooks`  
If using GitHub Desktop, and it doesn't work, check your PATH environment variable and make sure `C:\Program Files\Git\bin` is added before `%SystemRoot%\system32` and `C:\Program Files\Git\cmd`
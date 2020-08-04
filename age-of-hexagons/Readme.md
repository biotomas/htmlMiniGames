# Developer Setup (Docker)

## Startup
1. $ docker-compose up
1. $ firefox http://localhost/aoh

## Stop
1. $ docker-compose down

## Stop and Remove Database
1. $ docker-compose rm --volumes --force

## Notes:
- If you want to run on another port, change the port in docker-compose.yml
- by default mysql instance is bound to local port 3306 to allow inspecting the db with local tools. This is not needed for the setup to work, so you can remove this if you have a local conflict on that port.

# Developer Setup (Windows)
* You need a webserver, php and mysql
* On windows you can use XAMPP
* clone this git repo into your htdocs dir
* e.g. C:/xampp/htdocs/aoh

## Prepare Database
1. connect to mysql/mariadb and run database.sql

## Setup Environment Variables
1. set these environment variables on your machine:
1. for testing different settings quickly, you can override values in common.php
* AOH_BASE_URL=http://localhost:80/aoh
* AOH_FPS=60
* AOH_DB_SERVER=localhost:3306
* AOH_DB_SCHEMA=aoh
* AOH_DB_USER=aoh
* AOH_DB_PASS=aoh

# TODO List (In order or priority)
1. each unit can move once per turn + 2 extra moves
1. symmetry for level editor
1. random level generator
1. End of game detection
1. Help document with the game rules
1. Tutorial levels for game rules
1. AI bot player
1. Single player / coop multiplayer levels vs AI bot
  

# Acorns Manager Bot
## For start using 
  ### Create .env file 
  ### Add constant NODE_BOT_TOKEN from telegram bot in .env file
  ### `npm i`
## install pm2, then run `pm2 start index.js`
## For run scheduler, install crontab, then crontab -e
```
HOME=/path_to_directory_project
0  10 * * 2  node ./src/tools/scheduler.js poll training >> /tmp/logs 2>&1
```

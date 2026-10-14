@echo off
set PUPPETEER_SKIP_DOWNLOAD=1
set TMP=D:\Hackathon\temp
set TEMP=D:\Hackathon\temp
set NODE_OPTIONS=--max-old-space-size=4096
corepack yarn build

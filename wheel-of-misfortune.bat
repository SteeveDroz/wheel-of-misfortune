@echo off
where php
if %ERRORLEVEL% neq 0 (
    echo Be sure to have php7.0+ in your PATH variable. If you don't know how to do, follow this link: https://lmgtfy.com/?q=add+php+to+path+variable
    pause
)
if %ERRORLEVEL%==0 (
    start http://localhost:3000
    php -S localhost:3000 -t resources
)

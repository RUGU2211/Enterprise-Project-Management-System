@echo off
echo Starting Spring Boot Backend...
cd project_management_tool
echo Looking for Spring Boot launcher...

if exist mvnw.cmd (
    echo Found mvnw.cmd - using it to launch Spring Boot
    call mvnw.cmd spring-boot:run -Dserver.port=8081
) else if exist mvnw (
    echo Found mvnw - using it to launch Spring Boot
    call .\mvnw spring-boot:run -Dserver.port=8081
) else (
    echo Could not find mvnw.cmd or mvnw, attempting with 'mvn'
    mvn spring-boot:run -Dserver.port=8081
)
echo Backend server stopped.
pause 
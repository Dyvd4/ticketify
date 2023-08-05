docker compose -f .\docker-compose.base.yml -f .\docker-compose.dev.yml up -d
Set-Location .\Client\
npm run start
docker compose -f .\docker-compose.yml -f .\docker-compose.local.yml up -d
Set-Location .\Client\
npm i --legacy-peer-deps
npm run start
#!/bin/bash
docker-compose exec app chown -R node /usr/src/app/node_modules
docker-compose exec app npx prisma generate
docker-compose exec app npx prisma migrate dev
docker-compose exec app npx prisma db seed

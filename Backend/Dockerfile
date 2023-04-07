FROM node:16 as dev
WORKDIR /api
COPY ./package*.json .
RUN npm install
COPY . .
RUN npx prisma generate
CMD [ "npm" , "run", "start:dev"]

# FROM node:16 as prod
# WORKDIR /api
# COPY ./package*.json .
# RUN npm install
# COPY . .
# CMD [ "npm" , "run", "start:dev"]
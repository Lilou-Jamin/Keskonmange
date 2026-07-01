FROM node:24-alpine

RUN apk add --no-cache curl

WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./
RUN npm install

# Copy the rest of the application source code to the container
COPY . .

EXPOSE 3000

# Define environment variables
ENV NODE_ENV=production

CMD ["node", "server.js"]
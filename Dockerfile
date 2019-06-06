# Base Image
FROM node:10

WORKDIR /usr/src/app

# Install dependencies
COPY ./package.json ./
RUN npm install
COPY ./ ./

EXPOSE 8080

# Default command
CMD ["npm", "start"]

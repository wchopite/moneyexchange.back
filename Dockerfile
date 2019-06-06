# Base Image
FROM node:10

WORKDIR /usr/app

# Install dependencies
COPY ./package.json ./
RUN npm install
COPY ./ ./

EXPOSE 8080 8080

# Default command
CMD ["npm", "start"]

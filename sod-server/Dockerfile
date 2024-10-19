FROM node:23-alpine as backend

WORKDIR /backend

COPY ./backend/package.json ./
COPY ./backend/package-lock.json ./
RUN npm ci

COPY . .

RUN npm run build

FROM node:16.9.0-alpine as production

RUN mkdir -p /home/node && chown -R node:node /home/node

# set working directory to /home/node as we will run the app using the user 'node'
WORKDIR /home/node

# Copy package.json and package-lock.json
COPY ./package.json ./
COPY ./package-lock.json ./

# Switch to user node
USER node

# Install libraries as user node. If NODE_ENV=production dev_dependencies will not be installed.
RUN npm ci --production=true

# Copy built js files for server and change ownership to user node. 
COPY --chown=node:node --from=backend /backend/build /home/node/backend

# run the server
CMD ["node", "./backend/index.js"]
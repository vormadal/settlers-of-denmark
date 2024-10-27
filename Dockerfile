# build the Vue app for production
FROM node:23-alpine AS client

# working directory inside the container
WORKDIR /frontend

# copy package.json and lock file from host to image and install node modules
# this will speed up rebuilding image due to changes of source files as
# these layer are cached and do not have to be rebuilt
COPY ./sod-client/package.json ./
COPY ./sod-client/package-lock.json ./
RUN npm ci

#copy the rest of the source files into the container
COPY ./sod-client .

# build the app ##
RUN npm run build

FROM node:23-alpine AS backend

WORKDIR /backend

COPY ./sod-server/package.json ./
COPY ./sod-server/package-lock.json ./
RUN npm ci

COPY ./sod-server .

RUN npm run build

FROM node:23-alpine AS production

RUN mkdir -p /home/node && chown -R node:node /home/node

# set working directory to /home/node as we will run the app using the user 'node'
WORKDIR /home/node

# Copy package.json and package-lock.json
COPY ./sod-server/package.json ./
COPY ./sod-server/package-lock.json ./

# Switch to user node
USER node

# Install libraries as user node. If NODE_ENV=production dev_dependencies will not be installed.
RUN npm ci --omit=dev

ENV NODE_ENV=production

# Copy built js files for server and change ownership to user node. 
COPY --chown=node:node --from=backend /backend/build /home/node/backend

# Copy build js files for react app and change ownership to user node.
COPY --chown=node:node --from=client /frontend/build /home/node/backend/public

# run the server
CMD ["node", "./backend/index.js"]
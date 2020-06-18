# Use alpine node version
FROM node:10.15.3-alpine

# Create working directory and set node user as owner
WORKDIR /usr/src/app
RUN chown node:node /usr/src/app

# Switch to node user
USER node

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY --chown=node:node package*.json ./
RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source setting node user as owner
COPY --chown=node:node . .

CMD npx wdio wdio.conf.js
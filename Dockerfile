# Use DEFRA base node version
FROM defradigital/node:1.0.2-node12.16.0
ENV NODE_ENV=development

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY --chown=node:node package*.json ./
RUN npm install

# Bundle app source setting node user as owner
COPY --chown=node:node . .

CMD npx wdio wdio.conf.js

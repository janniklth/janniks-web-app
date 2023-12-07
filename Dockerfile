FROM node:20.9.0
LABEL name="janniks-web-app"
LABEL authors="Jannik Loth"
LABEL version="1.0.0"
LABEL description="Docker image for janniks-web-app."

# set working directory
WORKDIR /app

# copy package.json and package-lock.json
COPY package*.json ./

# install dependencies
RUN npm install

# copy app source code
COPY . .

# expose port 3000
EXPOSE 3000

# start app
CMD ["npm", "start"]
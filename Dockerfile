FROM mhart/alpine-node:12

# install polka web server
WORKDIR /app
COPY package.json ./
RUN npm install polka

# Copy only the npm dependencies installed on the previous step
FROM mhart/alpine-node:slim-12

WORKDIR /app
COPY --from=0 /app .
COPY . .

EXPOSE 3000

CMD ["node", "demo.js"]
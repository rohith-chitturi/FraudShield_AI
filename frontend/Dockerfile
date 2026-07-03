FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Run the dev server so it maps correctly in docker-compose for hot reload
CMD ["npm", "run", "dev", "--", "--host"]

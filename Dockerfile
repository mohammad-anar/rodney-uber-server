# -------- BUILD STAGE --------
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build


# -------- PRODUCTION STAGE --------
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist
COPY wait-for-mongo.sh /wait-for-mongo.sh
RUN chmod +x /wait-for-mongo.sh

EXPOSE 5000

CMD ["/wait-for-mongo.sh"]
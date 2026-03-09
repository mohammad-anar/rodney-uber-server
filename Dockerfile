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
COPY wait-for-mongo.sh ./   # <-- add this line
RUN chmod +x wait-for-mongo.sh  # make it executable

EXPOSE 5000

CMD ["sh", "./wait-for-mongo.sh"]
# ===================================
# Stage 1: Development
# ===================================
FROM node:20-alpine AS development

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./

EXPOSE 3001

CMD ["npm", "run", "dev"]

# ===================================
# Stage 2: Builder (TypeScript → JS)
# ===================================
FROM development AS builder

COPY src ./src
RUN npm run build

# ===================================
# Stage 3: Production runtime
# ===================================
FROM node:20-alpine AS production

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

EXPOSE 3001

CMD ["npm", "start"]

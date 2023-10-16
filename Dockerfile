# Use a smaller base image
FROM node:16-alpine as build

WORKDIR /app


ENV NODE_ENV=production

# Copy package.json and package-lock.json separately
COPY package.json /app/
COPY package-lock.json /app/

# Install npm dependencies and TypeScript
RUN npm ci
RUN npm install typescript

# Copy your application code
COPY . /app

# ---- Second Stage (Final Image) ----
FROM node:16-alpine

# Combine update and package installations
RUN apk update && \
    apk add --no-cache \
      nmap \
      ghostscript \
      chromium \
      harfbuzz \
      "freetype>2.8" \
      ttf-freefont \
      nss

# Set environment variables
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=false

WORKDIR /app

# Copy the built application from the previous stage
COPY --from=build /app /app

EXPOSE 8080

CMD ["npm", "start"]

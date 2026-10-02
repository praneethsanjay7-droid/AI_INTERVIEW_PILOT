FROM node:20-bookworm

WORKDIR /app

RUN apt-get update && \
    apt-get install -y ffmpeg && \
    rm -rf /var/lib/apt/lists/*

COPY server/package*.json ./

RUN npm ci

COPY server/ .

ENV FFMPEG_PATH=/usr/bin/ffmpeg

EXPOSE 5000

CMD ["npm", "start"]
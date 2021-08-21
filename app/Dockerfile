FROM node:12 AS builder
WORKDIR /build
COPY ./ ./
RUN npm install
RUN npm run-script build

FROM node:12
EXPOSE 8080:8080
RUN mkdir /app
COPY --from=builder build/build/ /app/build/
WORKDIR /app
RUN npm install -g serve
CMD ["serve", "-p", "8080", "-s", "build"]

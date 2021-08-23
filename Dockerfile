FROM openjdk:11-jdk AS builder
WORKDIR /build
COPY ./ ./
RUN ./gradlew installDist

FROM openjdk:11-jdk
EXPOSE 8080:8080
RUN mkdir /app
COPY --from=builder build/build/install/what-is-that/ /app/
COPY --from=builder build/src/main/resources/ /app/resources/
ENV SENTENCES_PATH="/app/resources"
WORKDIR /app/bin
CMD ["./what-is-that"]
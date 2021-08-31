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
ENV JAVA_OPTS="-Djava.security.egd=file:/dev/./urandom"
WORKDIR /app/bin
CMD ["./what-is-that"]
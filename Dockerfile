FROM openjdk:11-jdk AS builder
RUN ./gradlew installDist

FROM openjdk:11-jdk
EXPOSE 8080:8080
RUN mkdir /app
COPY --from=builder build/build/install/what-is-that/ /app/
WORKDIR /app/bin
CMD ["./what-is-that"]
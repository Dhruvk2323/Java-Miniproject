# ===== STAGE 1: Build the JAR =====
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# ===== STAGE 2: Run the JAR =====
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/expense-tracker-backend-1.0.0.jar app.jar

# Use PORT env var (Render injects this)
EXPOSE 8080

ENTRYPOINT ["java", "-Dspring.profiles.active=mysql", "-jar", "app.jar"]

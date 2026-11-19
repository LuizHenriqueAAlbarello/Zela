# ---------- Estágio 1: build com Maven ----------
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn -B -q dependency:go-offline
COPY src ./src
RUN mvn -B -q clean package -DskipTests

# ---------- Estágio 2: imagem final enxuta, só com o JRE ----------
FROM eclipse-temurin:17-jre
WORKDIR /app
RUN useradd --system --no-create-home zela
COPY --from=build /app/target/zela-api.jar app.jar
USER zela

# Evita ORA-01882 (timezone) no Oracle e respeita a memória pequena do plano gratuito do Render
ENV JAVA_TOOL_OPTIONS="-Doracle.jdbc.timezoneAsRegion=false -XX:MaxRAMPercentage=75"

# O Render injeta PORT; a aplicação lê PORT (padrão 8080)
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]

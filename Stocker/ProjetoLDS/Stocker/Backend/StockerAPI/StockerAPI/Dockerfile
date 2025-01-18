FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER app
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS test
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["StockerTests/StockerTests.csproj", "StockerTests/"]
RUN dotnet restore "./StockerTests/StockerTests.csproj"
COPY . .
WORKDIR "/src/StockerTests"
RUN dotnet test "./StockerTests.csproj" -c $BUILD_CONFIGURATION -o /app/test

# Esta fase é usada para compilar o projeto de serviço
FROM test AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["StockerAPI/StockerAPI.csproj", "StockerAPI/"]
RUN dotnet restore "./StockerAPI/StockerAPI.csproj"
COPY . .
WORKDIR "/src/StockerAPI"
RUN dotnet build "./StockerAPI.csproj" -c $BUILD_CONFIGURATION -o /app/build

# Esta fase é usada para publicar o projeto de serviço a ser copiado para a fase final
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./StockerAPI.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Esta fase é usada na produção ou quando executada no VS no modo normal (padrão quando não está usando a configuração de Depuração)
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "StockerAPI.dll"]
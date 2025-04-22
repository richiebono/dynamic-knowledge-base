#!/bin/bash

# Definir os caminhos dos arquivos
ROOT_DIR=$(pwd)
ENV_FILE="$ROOT_DIR/.env"
ENV_BASE64_FILE="$ROOT_DIR/envs.base64"

# Verificar se o arquivo .env existe
if [ ! -f "$ENV_FILE" ]; then
    echo "Erro: Arquivo .env não encontrado em $ENV_FILE"
    exit 1
fi

# Ler o arquivo .env e codificar em base64
echo "Codificando arquivo .env em base64..."
base64 "$ENV_FILE" > "$ENV_BASE64_FILE"

echo "Arquivo codificado em base64 gerado com sucesso em $ENV_BASE64_FILE"

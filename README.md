<p align="center">
  <img src="./packages/twenty-front/public/icons/android/android-launchericon-192-192.png" width="100px" alt="JusDeal logo" />
</p>

<h2 align="center">JusDeal - CRM Jurídico</h2>

<p align="center">
  CRM especializado para escritórios de advocacia e departamentos jurídicos.<br/>
  Baseado no <a href="https://github.com/twentyhq/twenty">Twenty CRM</a> (Open Source).
</p>

<br />

# 🚀 Instalação

## Docker (Recomendado)

```bash
docker pull heliomenezes/jusdeal:latest
```

## Docker Compose

```yaml
version: '3.8'
services:
  jusdeal:
    image: heliomenezes/jusdeal:latest
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/jusdeal
      - REDIS_URL=redis://redis:6379
```

## EasyPanel

Consulte o arquivo `easypanel-jusdeal-schema.json` para deploy via EasyPanel.

<br />

# ⚖️ Funcionalidades Jurídicas

## Oportunidades com Origem
- **INBOUND**: Leads que chegaram organicamente
- **OUTBOUND**: Prospecção ativa

## Campos Personalizados
- Regime Tributário
- CNPJ
- Valor de Dívidas
- Segmento Empresarial

## Gestão de Empresas e Contatos
- Associação automática de contatos a empresas
- Histórico de interações
- Pipeline de vendas customizável

<br />

# 📊 Migração do HubSpot

Scripts incluídos para migração de dados do HubSpot:

```bash
cd scripts
python3 generate_clean_csvs.py
```

Gera CSVs prontos para importação:
- `companies_ready.csv`
- `contacts_ready.csv`
- `opportunities_ready.csv`

<br />

# 🛠️ Stack Técnica

- [TypeScript](https://www.typescriptlang.org/)
- [Nx](https://nx.dev/)
- [NestJS](https://nestjs.com/) + [PostgreSQL](https://www.postgresql.org/) + [Redis](https://redis.io/)
- [React](https://reactjs.org/) + [Recoil](https://recoiljs.org/)

<br />

# 🙏 Créditos

Este projeto é um fork do [Twenty CRM](https://github.com/twentyhq/twenty), o CRM open-source #1 do mundo.

Customizado para atender às necessidades específicas do mercado jurídico brasileiro.

<br />

# 📄 Licença

Este projeto mantém a licença original do Twenty CRM (AGPL-3.0).

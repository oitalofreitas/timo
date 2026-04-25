# WhatsApp Integration

## Setup Produção

### 1. Railway (Baileys Server)

```bash
# Criar projeto Railway com PostgreSQL
railway init
railway add -d postgresql

# Deploy
railway up
```

Copie `DATABASE_URL` e `BAILEYS_SERVER_URL` de Railway.

### 2. Vercel (Next.js)

```bash
# Deploy
vercel deploy --prod
```

Configure variáveis de ambiente:
- `DATABASE_URL` → PostgreSQL do Railway
- `NEXTAUTH_URL` → seu domínio Vercel
- `NEXTAUTH_SECRET` → gere com `openssl rand -base64 32`
- `BAILEYS_SERVER_URL` → URL do Railway
- `NEXT_PUBLIC_BAILEYS_SERVER_URL` → URL pública do Railway

## Features

- ✅ Conectar WhatsApp via QR code
- ✅ QR code em tempo real (SSE)
- ✅ Enviar mensagens
- ✅ Múltiplas conexões
- ✅ Persistência em PostgreSQL

## API

- `POST /api/whatsapp/connect` - Conectar
- `GET /api/whatsapp/status` - Status
- `POST /api/whatsapp/send` - Enviar mensagem
- `POST /api/whatsapp/disconnect` - Desconectar
- `GET /api/whatsapp/connections` - Listar
- `POST /api/whatsapp/connections` - Criar
- `DELETE /api/whatsapp/connections/[id]` - Deletar

# WhatsApp Integration

## Deployment para Produção (Vercel + Railway)

### 1. Configure Git e GitHub

```bash
git push origin main
```

Conecte seu repositório GitHub à:
- **Railway** para o Baileys server
- **Vercel** para o Next.js app

### 2. Deploy no Railway (Baileys Server)

1. Vá para [railway.app](https://railway.app)
2. Crie um novo projeto e selecione "GitHub"
3. Selecione este repositório
4. Configure as variáveis de ambiente:
   - `DATABASE_URL` → PostgreSQL (crie um banco no Railway)
   - `NODE_ENV=production`
5. Defina o comando de start: `node baileys-server.js`
6. Deploy

Copie a URL do Railway (ex: `https://seu-app.railway.app`)

### 3. Deploy no Vercel (Next.js)

1. Vá para [vercel.com](https://vercel.com)
2. Crie um novo projeto a partir do repositório GitHub
3. Configure as variáveis de ambiente:
   - `DATABASE_URL` → mesmo banco PostgreSQL do Railway
   - `NEXTAUTH_URL` → `https://timo-b6js.vercel.app`
   - `NEXTAUTH_SECRET` → gere com `openssl rand -base64 32`
   - `BAILEYS_SERVER_URL` → URL do Railway (ex: `https://seu-app.railway.app`)
   - `NEXT_PUBLIC_BAILEYS_SERVER_URL` → URL pública do Railway
4. Deploy

### 4. Inicializar Banco de Dados

Após o primeiro deploy no Railway, execute as migrations:

```bash
DATABASE_URL="postgresql://user:pass@host:5432/db" npx prisma migrate deploy
```

Ou use o Railway CLI:

```bash
railway run npx prisma migrate deploy
```

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

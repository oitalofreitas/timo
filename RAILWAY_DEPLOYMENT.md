# Deploy Baileys no Railway

## 📋 O que você vai fazer:

1. **Railway** = Servidor Baileys 24/7 rodando
2. **Vercel** = API que chama o Railway
3. **Resultado** = WhatsApp funcionando perfeitamente ✅

---

## 🚀 Passos:

### 1. Login no Railway
Acesse https://railway.app e faça login com sua conta

### 2. Criar novo projeto
- Clique em "New Project"
- Selecione "Deploy from GitHub"
- Selecione o repositório `oitalofreitas/timo`

### 3. Configurar deployment
Railway vai detectar automaticamente que é um projeto Node.js

Mas **execute este comando na pasta do projeto** para adicionar o arquivo de configuração:
```bash
# Já criado: Procfile
cat Procfile
# Retorna: web: npx ts-node baileys-server.ts
```

### 4. Adicionar variável de ambiente no Railway
No dashboard do Railway:
1. Vá para "Variables"
2. Clique em "Add Variable"
3. Nome: `NODE_ENV`
4. Valor: `production`
5. Salve

### 5. Deploy
Railway vai fazer deploy automaticamente. Espere aparecer "Running" (verde)

### 6. Copiar URL do servidor
No Railway, você verá algo como:
```
https://timo-production.up.railway.app
```

Copie essa URL! Você vai usar no Vercel.

---

## 🔗 Configurar Vercel para usar Railway

### 1. Adicionar variável de ambiente no Vercel
Na dashboard do Vercel:
1. Vá para "Settings" → "Environment Variables"
2. Adicione uma nova variável:
   - Nome: `BAILEYS_SERVER_URL`
   - Valor: `https://timo-production.up.railway.app` (cole a URL do Railway)
3. Salve

### 2. Fazer redeploy no Vercel
- Vá para "Deployments"
- Clique em "Redeploy" no último deployment
- Aguarde completar

---

## ✅ Testar

1. Acesse sua app Vercel (ex: `timo-b6js.vercel.app`)
2. Vá para `/whatsapp`
3. Clique em "Conectar Número"
4. **QR Code real deve aparecer!** 🎉
5. Escaneie com seu WhatsApp
6. Funciona! ✅

---

## 🔍 Troubleshooting

### QR code não aparece
- Verifique se Railway está "Running" (verde)
- Verifique se a variável `BAILEYS_SERVER_URL` está no Vercel
- Faça redeploy do Vercel

### Erro "Failed to connect"
- Railway pode estar em sleep (hobby plan)
- Acesse a URL do Railway diretamente para acordar: `https://seu-url-railway.app/health`

### Logs do Railway
- No dashboard do Railway, vá para "Logs"
- Procure por erros de Baileys

---

## 📊 Valores esperados

- **Railway**: ~R$ 5-10/mês (servidor 24/7)
- **Vercel**: Grátis
- **Resultado**: WhatsApp funcionando perfeitamente

---

## Próximos passos

Depois de funcionar:
1. Adicionar banco de dados para persistir sessões
2. Criar interface de chat
3. Integrar com seu CRM

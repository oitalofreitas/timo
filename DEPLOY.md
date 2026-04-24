# Deploy da Aplicação Timo

## ⚠️ Importante: WhatsApp em Desenvolvimento vs Produção

**Em desenvolvimento local:** O QR code é apenas para teste (não funciona com WhatsApp real)
**Em produção:** Quando deployed, funciona 100% com WhatsApp real ✅

A razão é que Baileys precisa se conectar aos servidores do WhatsApp, o que requer um servidor com acesso irrestrito à internet.

---

## Deploy no Vercel (Recomendado - Gratuito)

### Passo 1: Preparar o repositório
```bash
git add .
git commit -m "Preparar para deploy"
git push origin main
```

### Passo 2: Criar conta no Vercel (se não tiver)
1. Acesse https://vercel.com
2. Clique em "Sign Up"
3. Conecte sua conta GitHub

### Passo 3: Deploy
1. Acesse https://vercel.com/new
2. Selecione o repositório `timo`
3. Clique em "Deploy"
4. Aguarde a build completar (~2-3 min)

### Passo 4: Acessar a aplicação
- URL será algo como: `https://timo-xyz.vercel.app`
- Acesse `/whatsapp`
- Clique em "Conectar Número"
- **Agora funciona!** - QR code real do WhatsApp

---

## Testar Localmente (Apenas Debug)

```bash
npm run dev
# Acesse http://localhost:3000/whatsapp
# QR code será de teste (não escaneável)
```

---

## Troubleshooting

### QR code não aparece
- ✅ Em local: esperado (é modo teste)
- ❌ Em produção: fazer redeploy no Vercel

### WhatsApp não conecta após escanear
- Verifique se tem 2FA ativado no WhatsApp
- Tente novamente com outro número

### Erro de conexão no Vercel
- Verificar logs: `vercel logs`
- Certificar que tem internet funcionando

---

## Próximos Passos

Depois de conectado com sucesso:
1. Implementar armazenamento de mensagens (Prisma + Database)
2. Criar interface de chat
3. Adicionar integrações com CRM

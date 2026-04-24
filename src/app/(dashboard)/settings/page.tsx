"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  User, Palette, Bell, Plug, CreditCard, Smartphone, Zap, Check, ExternalLink
} from "lucide-react";

const integrations = [
  { id: "google-calendar", name: "Google Calendar", description: "Sincronize seus eventos", status: "available", icon: "📅" },
  { id: "asaas", name: "Asaas", description: "Cobranças automatizadas", status: "available", icon: "💳" },
  { id: "abacatepay", name: "AbacatePay", description: "Pagamentos PIX", status: "available", icon: "💚" },
  { id: "mercadopago", name: "Mercado Pago", description: "Pagamentos online", status: "available", icon: "🏦" },
  { id: "meta-pixel", name: "Meta Pixel", description: "Rastreamento de conversões", status: "available", icon: "📊" },
  { id: "google-drive", name: "Google Drive", description: "Armazenamento de arquivos", status: "available", icon: "📁" },
  { id: "stripe", name: "Stripe", description: "Pagamentos internacionais", status: "coming_soon", icon: "💎" },
  { id: "zapier", name: "Zapier", description: "Automações externas", status: "coming_soon", icon: "⚡" },
  { id: "slack", name: "Slack", description: "Notificações de equipe", status: "coming_soon", icon: "💬" },
  { id: "figma", name: "Figma", description: "Compartilhe designs", status: "coming_soon", icon: "🎨" },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Configurações</h1>
        <p className="text-muted-foreground text-sm">Personalize o Timo ao seu gosto</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="profile"><User className="mr-1.5 h-3.5 w-3.5" />Perfil</TabsTrigger>
          <TabsTrigger value="appearance"><Palette className="mr-1.5 h-3.5 w-3.5" />Aparência</TabsTrigger>
          <TabsTrigger value="notifications"><Bell className="mr-1.5 h-3.5 w-3.5" />Notificações</TabsTrigger>
          <TabsTrigger value="integrations"><Plug className="mr-1.5 h-3.5 w-3.5" />Integrações</TabsTrigger>
          <TabsTrigger value="subscription"><CreditCard className="mr-1.5 h-3.5 w-3.5" />Assinatura</TabsTrigger>
          <TabsTrigger value="mobile"><Smartphone className="mr-1.5 h-3.5 w-3.5" />Mobile</TabsTrigger>
        </TabsList>

        {/* Profile */}
        <TabsContent value="profile" className="mt-4">
          <Card>
            <CardHeader><CardTitle>Informações Pessoais</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary/20 text-primary text-lg font-semibold">JS</AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm">Alterar foto</Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome completo</Label>
                  <Input defaultValue="João Silva" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input defaultValue="joao@timo.com" type="email" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Telefone</Label>
                  <Input defaultValue="(11) 99999-9999" />
                </div>
                <div className="space-y-2">
                  <Label>Idioma</Label>
                  <Select defaultValue="pt-BR">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Separator />
              <p className="text-sm font-medium">Informações do Negócio</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome da empresa / workspace</Label>
                  <Input defaultValue="João Silva Studio" />
                </div>
                <div className="space-y-2">
                  <Label>Moeda padrão</Label>
                  <Select defaultValue="BRL">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BRL">BRL — Real</SelectItem>
                      <SelectItem value="USD">USD — Dólar</SelectItem>
                      <SelectItem value="EUR">EUR — Euro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Meta de receita mensal</Label>
                <Input defaultValue="20000" placeholder="R$ 0,00" />
              </div>
              <Button size="sm">Salvar alterações</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance */}
        <TabsContent value="appearance" className="mt-4">
          <Card>
            <CardHeader><CardTitle>Aparência</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Tema</Label>
                <div className="flex gap-3">
                  {["dark", "light", "system"].map((t) => (
                    <button
                      key={t}
                      className="flex-1 rounded-lg border border-border py-3 text-xs font-medium capitalize hover:border-primary transition-colors data-[active=true]:border-primary data-[active=true]:bg-primary/10"
                      data-active={t === "dark"}
                    >
                      {t === "dark" ? "Escuro" : t === "light" ? "Claro" : "Sistema"}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Cor primária</Label>
                <div className="flex items-center gap-3">
                  <input type="color" defaultValue="#6366f1" className="h-9 w-16 rounded border border-border cursor-pointer" />
                  <Input defaultValue="#6366f1" className="w-28" />
                </div>
              </div>
              <Button size="sm">Aplicar</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="mt-4">
          <Card>
            <CardHeader><CardTitle>Notificações</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Novo lead capturado", description: "Alerta quando um formulário externo captura um lead" },
                { label: "Orçamento visualizado", description: "Quando o cliente abre seu orçamento" },
                { label: "Orçamento aprovado", description: "Quando um orçamento é aprovado" },
                { label: "Pagamento recebido", description: "Confirmação de pagamentos via gateway" },
                { label: "Briefing respondido", description: "Quando um cliente preenche o briefing" },
                { label: "Vencimentos próximos", description: "Alertas de contas a receber/pagar vencendo em breve" },
              ].map((n) => (
                <div key={n.label} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{n.label}</p>
                    <p className="text-xs text-muted-foreground">{n.description}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations */}
        <TabsContent value="integrations" className="mt-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {integrations.map((intg) => (
              <Card key={intg.id} className={intg.status === "coming_soon" ? "opacity-60" : ""}>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{intg.icon}</span>
                      <div>
                        <p className="text-sm font-medium">{intg.name}</p>
                        <p className="text-xs text-muted-foreground">{intg.description}</p>
                      </div>
                    </div>
                    {intg.status === "coming_soon" ? (
                      <Badge variant="secondary" className="text-[10px]">Em breve</Badge>
                    ) : (
                      <Button size="sm" variant="outline">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Subscription */}
        <TabsContent value="subscription" className="mt-4">
          <Card>
            <CardHeader><CardTitle>Plano Atual</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-primary/10 border border-primary/30 p-4 flex items-center gap-3">
                <Zap className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Timo Pro</p>
                  <p className="text-xs text-muted-foreground">Próxima cobrança: 01/05/2026 · R$ 97/mês</p>
                </div>
                <Badge className="ml-auto">Ativo</Badge>
              </div>
              <div className="space-y-2">
                {["Clientes ilimitados", "Todos os módulos", "Suporte prioritário", "Agentes IA", "Portfolio profissional"].map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" />
                    {f}
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm">Gerenciar assinatura</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Mobile */}
        <TabsContent value="mobile" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center gap-4 py-6">
                <div className="h-16 w-16 rounded-2xl bg-primary/20 flex items-center justify-center">
                  <Smartphone className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-lg">Timo Mobile</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Acesse seu CRM de qualquer lugar. Disponível para iOS e Android.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm">App Store</Button>
                  <Button variant="outline" size="sm">Google Play</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

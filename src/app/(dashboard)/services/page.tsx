"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, MoreHorizontal, Package, Repeat, ExternalLink, Wrench } from "lucide-react";
import { formatCurrency } from "@/lib/format";

const services = [
  { id: "1", name: "Website Institucional", description: "Site completo com até 5 páginas", price: 3500, unit: "projeto", category: "Web", active: true },
  { id: "2", name: "Identidade Visual", description: "Logo + manual da marca", price: 2800, unit: "projeto", category: "Design", active: true },
  { id: "3", name: "Social Media Mensal", description: "16 posts/mês + stories", price: 1200, unit: "mês", category: "Marketing", active: true },
  { id: "4", name: "Landing Page", description: "Página de vendas otimizada", price: 1800, unit: "página", category: "Web", active: false },
];

const plans = [
  { id: "1", name: "Starter", price: 997, interval: "monthly", features: ["5 posts/mês", "1 rede social", "Relatório mensal"] },
  { id: "2", name: "Pro", price: 1997, interval: "monthly", features: ["20 posts/mês", "3 redes sociais", "Stories", "Relatório semanal"] },
  { id: "3", name: "Enterprise", price: 3497, interval: "monthly", features: ["Ilimitado", "5 redes sociais", "Conteúdo premium", "Suporte prioritário"] },
];

export default function ServicesPage() {
  const [openService, setOpenService] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Serviços & Produtos</h1>
          <p className="text-muted-foreground text-sm">Catálogo do seu negócio</p>
        </div>
      </div>

      <Tabs defaultValue="services">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="services">Serviços</TabsTrigger>
            <TabsTrigger value="products">Produtos</TabsTrigger>
            <TabsTrigger value="plans">Planos</TabsTrigger>
            <TabsTrigger value="checkout">Checkout</TabsTrigger>
          </TabsList>
          <Button size="sm" onClick={() => setOpenService(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar
          </Button>
        </div>

        <TabsContent value="services" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <Card key={s.id} className={!s.active ? "opacity-60" : ""}>
                <CardHeader className="pb-2 flex flex-row items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Wrench className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-sm">{s.name}</CardTitle>
                      <Badge variant="secondary" className="text-[10px] mt-0.5">{s.category}</Badge>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-7 w-7" />}>
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Editar</DropdownMenuItem>
                      <DropdownMenuItem>Criar orçamento</DropdownMenuItem>
                      <DropdownMenuItem>{s.active ? "Desativar" : "Ativar"}</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Excluir</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-xs text-muted-foreground">{s.description}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold">{formatCurrency(s.price)}</p>
                    <p className="text-xs text-muted-foreground">/{s.unit}</p>
                  </div>
                  {!s.active && <Badge variant="secondary" className="text-[10px]">Inativo</Badge>}
                </CardContent>
              </Card>
            ))}
            <button
              onClick={() => setOpenService(true)}
              className="h-full min-h-[140px] rounded-lg border border-dashed border-border flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors"
            >
              <Plus className="h-6 w-6" />
              <span className="text-sm">Novo Serviço</span>
            </button>
          </div>
        </TabsContent>

        <TabsContent value="products" className="mt-4">
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <Package className="h-12 w-12 mb-3 opacity-40" />
            <p className="font-medium">Nenhum produto cadastrado</p>
            <Button className="mt-4" size="sm" onClick={() => setOpenService(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Produto
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="plans" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-3">
            {plans.map((p) => (
              <Card key={p.id} className="relative">
                {p.name === "Pro" && (
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                    <Badge className="text-[10px]">Popular</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{p.name}</CardTitle>
                  <div className="flex items-end gap-1">
                    <p className="text-2xl font-bold">{formatCurrency(p.price)}</p>
                    <p className="text-sm text-muted-foreground mb-1">/mês</p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {p.features.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {f}
                    </div>
                  ))}
                  <div className="pt-2 flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">Editar</Button>
                    <Button size="sm" className="flex-1">
                      <Repeat className="mr-1 h-3 w-3" />
                      Checkout
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            <button
              
              className="min-h-[200px] rounded-lg border border-dashed border-border flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors"
            >
              <Plus className="h-6 w-6" />
              <span className="text-sm">Novo Plano</span>
            </button>
          </div>
        </TabsContent>

        <TabsContent value="checkout" className="mt-4">
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <ExternalLink className="h-12 w-12 mb-3 opacity-40" />
            <p className="font-medium">Links de Checkout Direto</p>
            <p className="text-sm mb-4">Gere links de pagamento para seus serviços e planos</p>
            <Button variant="outline" size="sm">Criar link de checkout</Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Service Dialog */}
      <Dialog open={openService} onOpenChange={setOpenService}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Novo Serviço</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Nome *</Label>
              <Input placeholder="Ex: Website Institucional" />
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea placeholder="Descreva o serviço..." rows={2} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Preço *</Label>
                <Input placeholder="R$ 0,00" />
              </div>
              <div className="space-y-2">
                <Label>Unidade</Label>
                <Input placeholder="projeto, hora, mês..." />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Input placeholder="Web, Design, Marketing..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenService(false)}>Cancelar</Button>
            <Button onClick={() => setOpenService(false)}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

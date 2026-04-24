"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Search, FileText, MoreHorizontal, ExternalLink, Copy } from "lucide-react";
import { formatCurrency } from "@/lib/format";

const quotes = [
  { id: "1", number: "001", title: "Website Institucional", client: "Ana Costa", total: 4500, status: "APPROVED", createdAt: "2026-04-10" },
  { id: "2", number: "002", title: "Identidade Visual Completa", client: "Bruno Lima", total: 7800, status: "SENT", createdAt: "2026-04-12" },
  { id: "3", number: "003", title: "Social Media Pack", client: "Carla Souza", total: 2400, status: "DRAFT", createdAt: "2026-04-15" },
  { id: "4", number: "004", title: "App Mobile MVP", client: "Diego Ferreira", total: 22000, status: "SENT", createdAt: "2026-04-18" },
  { id: "5", number: "005", title: "E-commerce Completo", client: "Elena Martins", total: 14500, status: "REJECTED", createdAt: "2026-04-05" },
];

const statusConfig = {
  DRAFT: { label: "Rascunho", variant: "secondary" as const },
  SENT: { label: "Enviado", variant: "default" as const },
  VIEWED: { label: "Visualizado", variant: "outline" as const },
  APPROVED: { label: "Aprovado", variant: "default" as const },
  REJECTED: { label: "Recusado", variant: "destructive" as const },
  EXPIRED: { label: "Expirado", variant: "secondary" as const },
};

export default function QuotesPage() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = quotes.filter(
    (q) =>
      q.title.toLowerCase().includes(search.toLowerCase()) ||
      q.client.toLowerCase().includes(search.toLowerCase())
  );

  const approved = quotes.filter((q) => q.status === "APPROVED");
  const totalApproved = approved.reduce((a, q) => a + q.total, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Orçamentos</h1>
          <p className="text-muted-foreground text-sm">Crie e gerencie seus orçamentos</p>
        </div>
        <Button size="sm" onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Orçamento
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="pt-4">
            <p className="text-2xl font-bold">{quotes.filter((q) => q.status === "DRAFT").length}</p>
            <p className="text-xs text-muted-foreground">Rascunhos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-2xl font-bold">{quotes.filter((q) => q.status === "SENT").length}</p>
            <p className="text-xs text-muted-foreground">Enviados</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-2xl font-bold text-green-500">{approved.length}</p>
            <p className="text-xs text-muted-foreground">Aprovados</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-2xl font-bold text-green-500">{formatCurrency(totalApproved)}</p>
            <p className="text-xs text-muted-foreground">Valor aprovado</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="quotes">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="quotes">Orçamentos</TabsTrigger>
            <TabsTrigger value="contracts">Contratos</TabsTrigger>
            <TabsTrigger value="approval">Aprovação</TabsTrigger>
          </TabsList>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar..."
              className="pl-9 w-56"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <TabsContent value="quotes" className="mt-4">
          <div className="rounded-md border border-border overflow-hidden">
            {filtered.map((q, i) => (
              <div
                key={q.id}
                className={`flex items-center gap-4 px-4 py-3 hover:bg-muted/30 ${i !== 0 ? "border-t border-border" : ""}`}
              >
                <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{q.title}</p>
                  <p className="text-xs text-muted-foreground">#{q.number} · {q.client} · {new Date(q.createdAt).toLocaleDateString("pt-BR")}</p>
                </div>
                <Badge variant={statusConfig[q.status as keyof typeof statusConfig].variant} className="text-xs">
                  {statusConfig[q.status as keyof typeof statusConfig].label}
                </Badge>
                <p className="text-sm font-bold tabular-nums">{formatCurrency(q.total)}</p>
                <DropdownMenu>
                  <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-7 w-7" />}>
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem><ExternalLink className="mr-2 h-3 w-3" />Visualizar</DropdownMenuItem>
                    <DropdownMenuItem><Copy className="mr-2 h-3 w-3" />Copiar link</DropdownMenuItem>
                    <DropdownMenuItem>Editar</DropdownMenuItem>
                    <DropdownMenuItem>Duplicar</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Arquivar</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="contracts">
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <FileText className="h-12 w-12 mb-3 opacity-40" />
            <p className="font-medium">Nenhum contrato ainda</p>
            <p className="text-sm">Crie um contrato a partir de um orçamento aprovado</p>
          </div>
        </TabsContent>

        <TabsContent value="approval">
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <ExternalLink className="h-12 w-12 mb-3 opacity-40" />
            <p className="font-medium">Página de Aprovação Online</p>
            <p className="text-sm mb-4">Seu cliente pode aprovar orçamentos pelo link público</p>
            <Button variant="outline" size="sm">Configurar página</Button>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Novo Orçamento</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Título *</Label>
              <Input placeholder="Ex: Website Institucional" />
            </div>
            <div className="space-y-2">
              <Label>Cliente</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Ana Costa</SelectItem>
                  <SelectItem value="2">Bruno Lima</SelectItem>
                  <SelectItem value="3">Carla Souza</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Validade</Label>
              <Input type="date" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={() => setOpen(false)}>Criar Orçamento</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

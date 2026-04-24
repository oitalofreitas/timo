"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import { Plus, Search, ClipboardList, MoreHorizontal, ExternalLink, Clock, CheckCircle } from "lucide-react";

const briefingTypes = [
  "Website",
  "Identidade Visual",
  "Social Media",
  "App Mobile",
  "E-commerce",
  "Fotografia",
];

const briefings = [
  { id: "1", title: "Briefing Website Institucional", client: "Ana Costa", type: "Website", status: "ANSWERED", createdAt: "2026-04-10" },
  { id: "2", title: "Briefing Identidade Visual", client: "Bruno Lima", type: "Identidade Visual", status: "PENDING", createdAt: "2026-04-15" },
  { id: "3", title: "Briefing Social Media", client: "Carla Souza", type: "Social Media", status: "SENT", createdAt: "2026-04-18" },
  { id: "4", title: "Briefing App Mobile", client: "Diego Ferreira", type: "App Mobile", status: "PENDING", createdAt: "2026-04-19" },
];

const statusConfig = {
  PENDING: { label: "Pendente", icon: Clock, class: "text-yellow-500 bg-yellow-500/20" },
  SENT: { label: "Enviado", icon: ExternalLink, class: "text-blue-500 bg-blue-500/20" },
  ANSWERED: { label: "Respondido", icon: CheckCircle, class: "text-green-500 bg-green-500/20" },
};

export default function BriefingsPage() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filtered = briefings.filter((b) => {
    const matchSearch =
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.client.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || b.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Briefings</h1>
          <p className="text-muted-foreground text-sm">Coleta de informações dos projetos</p>
        </div>
        <Button size="sm" onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Briefing
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {(["PENDING", "SENT", "ANSWERED"] as const).map((s) => {
          const cfg = statusConfig[s];
          const count = briefings.filter((b) => b.status === s).length;
          return (
            <Card key={s}>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${cfg.class}`}>
                    <cfg.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{count}</p>
                    <p className="text-xs text-muted-foreground">{cfg.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar briefings..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v ?? "all")}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="PENDING">Pendentes</SelectItem>
            <SelectItem value="SENT">Enviados</SelectItem>
            <SelectItem value="ANSWERED">Respondidos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Templates */}
      <div>
        <h2 className="text-sm font-medium text-muted-foreground mb-3">Templates pré-configurados</h2>
        <div className="flex flex-wrap gap-2">
          {briefingTypes.map((type) => (
            <Badge
              key={type}
              variant="outline"
              className="cursor-pointer hover:bg-primary/20 hover:border-primary/50 transition-colors px-3 py-1"
            >
              <ClipboardList className="mr-1.5 h-3 w-3" />
              {type}
            </Badge>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="rounded-md border border-border overflow-hidden">
        {filtered.map((b, i) => {
          const cfg = statusConfig[b.status as keyof typeof statusConfig];
          return (
            <div
              key={b.id}
              className={`flex items-center gap-4 px-4 py-3 hover:bg-muted/30 ${i !== 0 ? "border-t border-border" : ""}`}
            >
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${cfg.class}`}>
                <cfg.icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{b.title}</p>
                <p className="text-xs text-muted-foreground">{b.client} · {b.type} · {new Date(b.createdAt).toLocaleDateString("pt-BR")}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.class}`}>
                {cfg.label}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-7 w-7" />}>
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem><ExternalLink className="mr-2 h-3 w-3" />Copiar link</DropdownMenuItem>
                  <DropdownMenuItem>Ver respostas</DropdownMenuItem>
                  <DropdownMenuItem>Editar</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">Excluir</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        })}
      </div>

      {/* New Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Novo Briefing</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Título *</Label>
              <Input placeholder="Ex: Briefing Website XYZ" />
            </div>
            <div className="space-y-2">
              <Label>Tipo / Template</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Selecione um template..." /></SelectTrigger>
                <SelectContent>
                  {briefingTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Cliente</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Selecione o cliente..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Ana Costa</SelectItem>
                  <SelectItem value="2">Bruno Lima</SelectItem>
                  <SelectItem value="3">Carla Souza</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={() => setOpen(false)}>Criar Briefing</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

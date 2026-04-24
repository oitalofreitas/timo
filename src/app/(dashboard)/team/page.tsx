"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
import { UserPlus, MoreHorizontal, Mail, Shield, Crown, Eye } from "lucide-react";
import { initials } from "@/lib/format";

const members = [
  { id: "1", name: "João Silva", email: "joao@timo.com", role: "OWNER", status: "ACCEPTED", joinedAt: "2026-01-01" },
  { id: "2", name: "Maria Santos", email: "maria@agency.com", role: "ADMIN", status: "ACCEPTED", joinedAt: "2026-02-15" },
  { id: "3", name: "Pedro Costa", email: "pedro@freelance.com", role: "MEMBER", status: "PENDING" },
];

const roleConfig = {
  OWNER: { label: "Proprietário", icon: Crown, class: "text-yellow-500 bg-yellow-500/20" },
  ADMIN: { label: "Admin", icon: Shield, class: "text-blue-500 bg-blue-500/20" },
  MEMBER: { label: "Membro", icon: UserPlus, class: "text-primary bg-primary/20" },
  VIEWER: { label: "Visualizador", icon: Eye, class: "text-muted-foreground bg-muted" },
};

export default function TeamPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Equipe</h1>
          <p className="text-muted-foreground text-sm">Gerencie membros e permissões</p>
        </div>
        <Button size="sm" onClick={() => setOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Convidar Membro
        </Button>
      </div>

      <div className="grid gap-3">
        {members.map((m) => {
          const cfg = roleConfig[m.role as keyof typeof roleConfig];
          return (
            <Card key={m.id}>
              <CardContent className="pt-4">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                      {initials(m.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{m.name}</p>
                      {m.status === "PENDING" && (
                        <Badge variant="secondary" className="text-[10px]">Convite pendente</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      {m.email}
                    </div>
                  </div>
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.class}`}>
                    <cfg.icon className="h-3 w-3" />
                    {cfg.label}
                  </div>
                  {m.role !== "OWNER" && (
                    <DropdownMenu>
                      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-7 w-7" />}>
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Alterar permissão</DropdownMenuItem>
                        {m.status === "PENDING" && <DropdownMenuItem>Reenviar convite</DropdownMenuItem>}
                        <DropdownMenuItem className="text-destructive">Remover</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Permissions info */}
      <Card>
        <CardContent className="pt-4">
          <p className="text-sm font-medium mb-3">Níveis de acesso</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {Object.entries(roleConfig).map(([key, cfg]) => (
              <div key={key} className="flex items-center gap-2 text-sm">
                <div className={`flex items-center justify-center h-6 w-6 rounded ${cfg.class}`}>
                  <cfg.icon className="h-3 w-3" />
                </div>
                <div>
                  <span className="font-medium">{cfg.label}</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    {key === "OWNER" && "— Acesso total"}
                    {key === "ADMIN" && "— Gerencia tudo exceto faturamento"}
                    {key === "MEMBER" && "— Acesso a tarefas e clientes"}
                    {key === "VIEWER" && "— Apenas leitura"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Convidar Membro</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Email *</Label>
              <Input type="email" placeholder="colaborador@email.com" />
            </div>
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input placeholder="Nome do colaborador" />
            </div>
            <div className="space-y-2">
              <Label>Nível de acesso</Label>
              <Select defaultValue="MEMBER">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="MEMBER">Membro</SelectItem>
                  <SelectItem value="VIEWER">Visualizador</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={() => setOpen(false)}>Enviar convite</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

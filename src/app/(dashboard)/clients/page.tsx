"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  UserPlus,
  Search,
  LayoutGrid,
  List,
  MoreHorizontal,
  Link2,
  Users,
  TrendingUp,
  Star,
} from "lucide-react";
import { initials, formatCurrency } from "@/lib/format";

const mockClients = [
  { id: "1", name: "Ana Costa", email: "ana@studio.com", company: "Studio Ana", tags: ["Design"], estimatedValue: 12000 },
  { id: "2", name: "Bruno Lima", email: "bruno@agency.com", company: "BL Agency", tags: ["Dev", "UX"], estimatedValue: 28000 },
  { id: "3", name: "Carla Souza", email: "carla@brand.com", company: "Carla Branding", tags: ["Branding"], estimatedValue: 8500 },
  { id: "4", name: "Diego Ferreira", email: "diego@tech.io", company: "Tech.io", tags: ["Dev"], estimatedValue: 45000 },
  { id: "5", name: "Elena Martins", email: "elena@foto.art", company: "ElenaFoto", tags: ["Foto"], estimatedValue: 6000 },
];

export default function ClientsPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = mockClients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Clientes</h1>
          <p className="text-muted-foreground text-sm">Gerencie sua base de clientes</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Link2 className="mr-2 h-4 w-4" />
            Link de Cadastro
          </Button>
          <Button size="sm" onClick={() => setOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Novo Cliente
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{mockClients.length}</p>
                <p className="text-xs text-muted-foreground">Total de clientes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <Star className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-xs text-muted-foreground">Novos este mês</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">
                  {formatCurrency(mockClients.reduce((a, c) => a + (c.estimatedValue ?? 0), 0))}
                </p>
                <p className="text-xs text-muted-foreground">Valor estimado total</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, email ou empresa..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex border border-border rounded-md overflow-hidden">
          <Button
            variant={view === "grid" ? "default" : "ghost"}
            size="sm"
            className="rounded-none"
            onClick={() => setView("grid")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={view === "list" ? "default" : "ghost"}
            size="sm"
            className="rounded-none"
            onClick={() => setView("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

            {/* Client Grid */}
      {view === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((client) => (
            <Card key={client.id} className="hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="pt-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                        {initials(client.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{client.name}</p>
                      <p className="text-xs text-muted-foreground">{client.company}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-7 w-7" />}>
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Ver perfil</DropdownMenuItem>
                      <DropdownMenuItem>Editar</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Excluir</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <p className="text-xs text-muted-foreground">{client.email}</p>
                <div className="flex flex-wrap gap-1">
                  {client.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-[10px]">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs font-medium text-green-500">
                  {formatCurrency(client.estimatedValue ?? 0)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-md border border-border overflow-hidden">
          <div className="bg-muted/50 px-4 py-3 grid grid-cols-12 gap-4 font-medium text-sm text-muted-foreground border-b border-border sticky top-0">
            <div className="col-span-4">Cliente</div>
            <div className="col-span-3">Empresa</div>
            <div className="col-span-2">Tags</div>
            <div className="col-span-2 text-right">Valor</div>
            <div className="col-span-1"></div>
          </div>
          {filtered.length === 0 ? (
            <div className="px-4 py-8 text-center text-muted-foreground">
              Nenhum cliente encontrado
            </div>
          ) : (
            filtered.map((client) => (
              <div
                key={client.id}
                className="grid grid-cols-12 gap-4 px-4 py-3 items-center hover:bg-muted/40 transition-colors border-b border-border last:border-b-0"
              >
                <div className="col-span-4 flex items-center gap-3 min-w-0">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">
                      {initials(client.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{client.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{client.email}</p>
                  </div>
                </div>
                <div className="col-span-3">
                  <p className="text-sm text-muted-foreground truncate">{client.company}</p>
                </div>
                <div className="col-span-2 flex gap-1 flex-wrap">
                  {client.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-[10px]">{tag}</Badge>
                  ))}
                  {client.tags.length > 2 && (
                    <Badge variant="secondary" className="text-[10px]">+{client.tags.length - 2}</Badge>
                  )}
                </div>
                <div className="col-span-2 text-right">
                  <p className="text-sm font-medium text-green-500">
                    {formatCurrency(client.estimatedValue ?? 0)}
                  </p>
                </div>
                <div className="col-span-1 flex justify-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-7 w-7" />}>
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Ver perfil</DropdownMenuItem>
                      <DropdownMenuItem>Editar</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Excluir</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          )}
        </div>
      )}


      {/* New Client Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Novo Cliente</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nome *</Label>
                <Input placeholder="João Silva" />
              </div>
              <div className="space-y-2">
                <Label>Empresa</Label>
                <Input placeholder="Empresa Ltda" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" placeholder="joao@empresa.com" />
            </div>
            <div className="space-y-2">
              <Label>Telefone</Label>
              <Input placeholder="(11) 99999-9999" />
            </div>
            <div className="space-y-2">
              <Label>Valor Estimado</Label>
              <Input placeholder="R$ 0,00" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={() => setOpen(false)}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

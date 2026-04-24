"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, MoreHorizontal, DollarSign, ChevronDown } from "lucide-react";
import { formatCurrency } from "@/lib/format";

type Lead = {
  id: string;
  name: string;
  company: string;
  value: number;
  source: string;
  daysAgo: number;
};

type Stage = {
  id: string;
  name: string;
  color: string;
  leads: Lead[];
};

const initialStages: Stage[] = [
  {
    id: "new",
    name: "Novo Lead",
    color: "#6366f1",
    leads: [
      { id: "1", name: "Felipe Rocha", company: "FR Design", value: 3500, source: "Instagram", daysAgo: 1 },
      { id: "2", name: "Mariana Luz", company: "ML Studio", value: 7800, source: "Indicação", daysAgo: 2 },
    ],
  },
  {
    id: "contact",
    name: "Primeiro Contato",
    color: "#f59e0b",
    leads: [
      { id: "3", name: "Roberto Neves", company: "RN Agency", value: 12000, source: "LinkedIn", daysAgo: 3 },
    ],
  },
  {
    id: "proposal",
    name: "Proposta Enviada",
    color: "#10b981",
    leads: [
      { id: "4", name: "Sofia Dias", company: "SD Branding", value: 9500, source: "Google", daysAgo: 5 },
      { id: "5", name: "Carlos Melo", company: "Melo Tech", value: 22000, source: "Indicação", daysAgo: 7 },
    ],
  },
  {
    id: "negotiation",
    name: "Negociação",
    color: "#8b5cf6",
    leads: [],
  },
  {
    id: "won",
    name: "Fechado",
    color: "#22c55e",
    leads: [],
  },
];

export default function LeadsPage() {
  const [stages, setStages] = useState<Stage[]>(initialStages);
  const [openLead, setOpenLead] = useState(false);
  const [dragLead, setDragLead] = useState<{ lead: Lead; fromStage: string } | null>(null);

  function handleDragStart(lead: Lead, stageId: string) {
    setDragLead({ lead, fromStage: stageId });
  }

  function handleDrop(toStageId: string) {
    if (!dragLead || dragLead.fromStage === toStageId) return;
    setStages((prev) =>
      prev.map((stage) => {
        if (stage.id === dragLead.fromStage) {
          return { ...stage, leads: stage.leads.filter((l) => l.id !== dragLead.lead.id) };
        }
        if (stage.id === toStageId) {
          return { ...stage, leads: [...stage.leads, dragLead.lead] };
        }
        return stage;
      })
    );
    setDragLead(null);
  }

  const totalValue = stages.flatMap((s) => s.leads).reduce((a, l) => a + l.value, 0);

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Pipeline de Leads</h1>
          <p className="text-muted-foreground text-sm">
            {stages.flatMap((s) => s.leads).length} leads ·{" "}
            <span className="text-green-500 font-medium">{formatCurrency(totalValue)}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <ChevronDown className="mr-1 h-4 w-4" />
            Pipeline Principal
          </Button>
          <Button size="sm" onClick={() => setOpenLead(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Lead
          </Button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4 flex-1">
        {stages.map((stage) => (
          <div
            key={stage.id}
            className="flex-shrink-0 w-72"
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(stage.id)}
          >
            <div className="flex items-center gap-2 mb-3">
              <span
                className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: stage.color }}
              />
              <span className="font-medium text-sm">{stage.name}</span>
              <Badge variant="secondary" className="ml-auto text-xs">
                {stage.leads.length}
              </Badge>
            </div>

            <div className="space-y-2 min-h-[200px]">
              {stage.leads.map((lead) => (
                <Card
                  key={lead.id}
                  draggable
                  onDragStart={() => handleDragStart(lead, stage.id)}
                  className="cursor-grab active:cursor-grabbing hover:border-primary/50 transition-colors"
                >
                  <CardContent className="p-3 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-sm">{lead.name}</p>
                        <p className="text-xs text-muted-foreground">{lead.company}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-6 w-6" />}>
                      <MoreHorizontal className="h-3 w-3" />
                    </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
                          <DropdownMenuItem>Editar</DropdownMenuItem>
                          <DropdownMenuItem>Criar orçamento</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Excluir</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-green-500">
                        <DollarSign className="h-3 w-3" />
                        <span className="text-xs font-medium">{formatCurrency(lead.value)}</span>
                      </div>
                      <Badge variant="outline" className="text-[10px]">
                        {lead.source}
                      </Badge>
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      {lead.daysAgo === 1 ? "Ontem" : `${lead.daysAgo} dias atrás`}
                    </p>
                  </CardContent>
                </Card>
              ))}

              {/* Add card */}
              <button
                className="w-full rounded-md border border-dashed border-border py-2 text-xs text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors"
                onClick={() => setOpenLead(true)}
              >
                + Adicionar lead
              </button>
            </div>
          </div>
        ))}

        {/* Add stage */}
        <div className="flex-shrink-0 w-72">
          <button className="w-full rounded-lg border border-dashed border-border py-4 text-sm text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors">
            + Nova coluna
          </button>
        </div>
      </div>

      {/* New Lead Dialog */}
      <Dialog open={openLead} onOpenChange={setOpenLead}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Novo Lead</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nome *</Label>
                <Input placeholder="Nome do lead" />
              </div>
              <div className="space-y-2">
                <Label>Empresa</Label>
                <Input placeholder="Empresa" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" placeholder="email@exemplo.com" />
              </div>
              <div className="space-y-2">
                <Label>Telefone</Label>
                <Input placeholder="(11) 99999-9999" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Valor estimado</Label>
                <Input placeholder="R$ 0,00" />
              </div>
              <div className="space-y-2">
                <Label>Origem</Label>
                <Input placeholder="Instagram, Indicação..." />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenLead(false)}>Cancelar</Button>
            <Button onClick={() => setOpenLead(false)}>Criar Lead</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

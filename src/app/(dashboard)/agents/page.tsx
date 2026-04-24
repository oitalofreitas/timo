"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Bot, MessageCircle, Zap, Users, FileText, Plus } from "lucide-react";

const agents = [
  {
    id: "1",
    name: "Atendimento WhatsApp",
    description: "Responde automaticamente leads no WhatsApp com base nas suas informações",
    icon: MessageCircle,
    color: "#22c55e",
    active: true,
    stats: "128 conversas",
  },
  {
    id: "2",
    name: "Qualificação de Leads",
    description: "Qualifica e pontua leads automaticamente com base em critérios definidos",
    icon: Users,
    color: "#6366f1",
    active: true,
    stats: "47 leads qualificados",
  },
  {
    id: "3",
    name: "Gerador de Propostas",
    description: "Cria rascunhos de orçamentos baseado no histórico de projetos similares",
    icon: FileText,
    color: "#f59e0b",
    active: false,
    stats: "—",
  },
];

export default function AgentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Agentes IA</h1>
          <p className="text-muted-foreground text-sm">Automatize seu CRM com inteligência artificial</p>
        </div>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Criar Agente
        </Button>
      </div>

      {/* Banner */}
      <div className="rounded-lg border border-primary/30 bg-primary/10 p-4 flex items-start gap-3">
        <Bot className="h-5 w-5 text-primary mt-0.5" />
        <div>
          <p className="text-sm font-medium">Powered by Claude AI</p>
          <p className="text-xs text-muted-foreground">
            Os agentes do Timo são alimentados pelo modelo Claude da Anthropic para respostas precisas e contextuais.
          </p>
        </div>
        <Badge className="ml-auto shrink-0">Ativo</Badge>
      </div>

      {/* Agents grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent) => (
          <Card key={agent.id} className={!agent.active ? "opacity-70" : ""}>
            <CardHeader className="pb-2 flex flex-row items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="h-10 w-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: agent.color + "30" }}
                >
                  <agent.icon className="h-5 w-5" style={{ color: agent.color }} />
                </div>
                <CardTitle className="text-sm leading-tight">{agent.name}</CardTitle>
              </div>
              <Switch defaultChecked={agent.active} />
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-muted-foreground">{agent.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  {agent.stats}
                </span>
                <Button size="sm" variant="outline">Configurar</Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add agent */}
        <button className="min-h-[160px] rounded-lg border border-dashed border-border flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors">
          <Plus className="h-6 w-6" />
          <span className="text-sm">Novo Agente</span>
        </button>
      </div>
    </div>
  );
}

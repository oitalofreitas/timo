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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, MoreHorizontal, Calendar, Flag } from "lucide-react";

type Task = {
  id: string;
  title: string;
  description?: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  dueDate?: string;
  tags: string[];
};

type Column = {
  id: string;
  name: string;
  color: string;
  tasks: Task[];
};

const priorityConfig = {
  LOW: { label: "Baixa", color: "text-slate-400" },
  MEDIUM: { label: "Média", color: "text-yellow-500" },
  HIGH: { label: "Alta", color: "text-orange-500" },
  URGENT: { label: "Urgente", color: "text-red-500" },
};

const initialColumns: Column[] = [
  {
    id: "todo",
    name: "A fazer",
    color: "#6366f1",
    tasks: [
      { id: "1", title: "Criar wireframes da homepage", priority: "HIGH", tags: ["Design"], dueDate: "2026-04-25" },
      { id: "2", title: "Definir paleta de cores", priority: "MEDIUM", tags: ["Branding"] },
    ],
  },
  {
    id: "in_progress",
    name: "Em andamento",
    color: "#f59e0b",
    tasks: [
      { id: "3", title: "Desenvolver componentes React", priority: "URGENT", tags: ["Dev"], dueDate: "2026-04-22" },
      { id: "4", title: "Integração com API", priority: "HIGH", tags: ["Dev", "Backend"] },
    ],
  },
  {
    id: "review",
    name: "Revisão",
    color: "#8b5cf6",
    tasks: [
      { id: "5", title: "Revisar textos da landing page", priority: "MEDIUM", tags: ["Conteúdo"] },
    ],
  },
  {
    id: "done",
    name: "Concluído",
    color: "#22c55e",
    tasks: [
      { id: "6", title: "Setup inicial do projeto", priority: "LOW", tags: ["Dev"] },
    ],
  },
];

export default function ProjectsPage() {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [openTask, setOpenTask] = useState(false);
  const [dragTask, setDragTask] = useState<{ task: Task; fromCol: string } | null>(null);

  function handleDragStart(task: Task, colId: string) {
    setDragTask({ task, fromCol: colId });
  }

  function handleDrop(toColId: string) {
    if (!dragTask || dragTask.fromCol === toColId) return;
    setColumns((prev) =>
      prev.map((col) => {
        if (col.id === dragTask.fromCol) return { ...col, tasks: col.tasks.filter((t) => t.id !== dragTask.task.id) };
        if (col.id === toColId) return { ...col, tasks: [...col.tasks, dragTask.task] };
        return col;
      })
    );
    setDragTask(null);
  }

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Quadro de Tarefas</h1>
          <p className="text-muted-foreground text-sm">
            {columns.flatMap((c) => c.tasks).length} tarefas no total
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Meus Projetos</Button>
          <Button size="sm" onClick={() => setOpenTask(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Tarefa
          </Button>
        </div>
      </div>

      {/* Kanban */}
      <div className="flex gap-4 overflow-x-auto pb-4 flex-1">
        {columns.map((col) => (
          <div
            key={col.id}
            className="flex-shrink-0 w-72"
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(col.id)}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: col.color }} />
              <span className="font-medium text-sm">{col.name}</span>
              <Badge variant="secondary" className="ml-auto text-xs">{col.tasks.length}</Badge>
            </div>

            <div className="space-y-2 min-h-[120px]">
              {col.tasks.map((task) => (
                <Card
                  key={task.id}
                  draggable
                  onDragStart={() => handleDragStart(task, col.id)}
                  className="cursor-grab active:cursor-grabbing hover:border-primary/50 transition-colors"
                >
                  <CardContent className="p-3 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-sm leading-snug">{task.title}</p>
                      <DropdownMenu>
                        <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" />}>
                      <MoreHorizontal className="h-3 w-3" />
                    </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Editar</DropdownMenuItem>
                          <DropdownMenuItem>Mover para</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Excluir</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {task.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-[10px]">{tag}</Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className={`flex items-center gap-1 text-xs ${priorityConfig[task.priority].color}`}>
                        <Flag className="h-3 w-3" />
                        <span>{priorityConfig[task.priority].label}</span>
                      </div>
                      {task.dueDate && (
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(task.dueDate).toLocaleDateString("pt-BR")}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              <button
                className="w-full rounded-md border border-dashed border-border py-2 text-xs text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors"
                onClick={() => setOpenTask(true)}
              >
                + Adicionar tarefa
              </button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={openTask} onOpenChange={setOpenTask}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Nova Tarefa</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Título *</Label>
              <Input placeholder="Descreva a tarefa" />
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea placeholder="Detalhes opcionais..." rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Prioridade</Label>
                <Select defaultValue="MEDIUM">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Baixa</SelectItem>
                    <SelectItem value="MEDIUM">Média</SelectItem>
                    <SelectItem value="HIGH">Alta</SelectItem>
                    <SelectItem value="URGENT">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Vencimento</Label>
                <Input type="date" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Coluna</Label>
              <Select defaultValue="todo">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {columns.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenTask(false)}>Cancelar</Button>
            <Button onClick={() => setOpenTask(false)}>Criar Tarefa</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar,
  Clock,
  RefreshCw,
} from "lucide-react";

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTHS = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

type Event = {
  id: string;
  title: string;
  date: string;
  time: string;
  color: string;
  type: "task" | "meeting" | "deadline";
};

const events: Event[] = [
  { id: "1", title: "Reunião com Ana Costa", date: "2026-04-21", time: "10:00", color: "#6366f1", type: "meeting" },
  { id: "2", title: "Entregar wireframes", date: "2026-04-22", time: "18:00", color: "#f59e0b", type: "deadline" },
  { id: "3", title: "Review de código", date: "2026-04-24", time: "14:00", color: "#22c55e", type: "task" },
  { id: "4", title: "Call com Bruno Lima", date: "2026-04-25", time: "09:00", color: "#6366f1", type: "meeting" },
  { id: "5", title: "Prazo projeto identidade", date: "2026-04-28", time: "23:59", color: "#f43f5e", type: "deadline" },
];

export default function AgendaPage() {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 1));
  const [open, setOpen] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  function prevMonth() {
    setCurrentDate(new Date(year, month - 1, 1));
  }
  function nextMonth() {
    setCurrentDate(new Date(year, month + 1, 1));
  }

  function getEventsForDay(day: number) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return events.filter((e) => e.date === dateStr);
  }

  const upcomingEvents = events
    .filter((e) => new Date(e.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Agenda</h1>
          <p className="text-muted-foreground text-sm">Timeline de projetos e compromissos</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Google Calendar
          </Button>
          <Button size="sm" onClick={() => setOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Evento
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        {/* Calendar */}
        <Card>
          <CardContent className="p-4">
            {/* Nav */}
            <div className="flex items-center justify-between mb-4">
              <Button variant="ghost" size="icon" onClick={prevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="font-semibold">
                {MONTHS[month]} {year}
              </h2>
              <Button variant="ghost" size="icon" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Weekdays */}
            <div className="grid grid-cols-7 mb-2">
              {WEEKDAYS.map((d) => (
                <div key={d} className="text-center text-xs font-medium text-muted-foreground py-1">
                  {d}
                </div>
              ))}
            </div>

            {/* Days */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, i) => {
                if (!day) return <div key={`empty-${i}`} />;
                const isToday =
                  day === today.getDate() &&
                  month === today.getMonth() &&
                  year === today.getFullYear();
                const dayEvents = getEventsForDay(day);

                return (
                  <div
                    key={day}
                    className={`min-h-[64px] rounded-md p-1 cursor-pointer hover:bg-muted/50 transition-colors ${isToday ? "bg-primary/10 border border-primary/30" : ""}`}
                  >
                    <span
                      className={`text-xs font-medium ${isToday ? "text-primary" : "text-muted-foreground"} block text-center mb-1`}
                    >
                      {day}
                    </span>
                    <div className="space-y-0.5">
                      {dayEvents.slice(0, 2).map((ev) => (
                        <div
                          key={ev.id}
                          className="rounded px-1 py-0.5 text-[10px] truncate font-medium"
                          style={{ backgroundColor: ev.color + "30", color: ev.color }}
                        >
                          {ev.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <p className="text-[10px] text-muted-foreground pl-1">+{dayEvents.length - 2}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-3 text-muted-foreground">Próximos eventos</h3>
            <div className="space-y-2">
              {upcomingEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="flex items-start gap-2 rounded-lg border border-border p-3 hover:bg-muted/30 cursor-pointer transition-colors"
                >
                  <span
                    className="mt-1 h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: ev.color }}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{ev.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(ev.date).toLocaleDateString("pt-BR")}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {ev.time}
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-[10px] mt-1 px-1.5 py-0"
                      style={{ borderColor: ev.color + "60", color: ev.color }}
                    >
                      {ev.type === "meeting" ? "Reunião" : ev.type === "deadline" ? "Prazo" : "Tarefa"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Novo Evento</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Título *</Label>
              <Input placeholder="Ex: Reunião com cliente" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Data</Label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <Label>Horário</Label>
                <Input type="time" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea placeholder="Detalhes do evento..." rows={2} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={() => setOpen(false)}>Criar Evento</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

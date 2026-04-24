"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Camera, Hash, Briefcase, Video, Calendar } from "lucide-react";

const posts = [
  { id: "1", title: "Post carrossel — Dicas de UX", platform: "instagram", date: "2026-04-22", status: "scheduled", color: "#e1306c" },
  { id: "2", title: "Thread sobre freelance", platform: "twitter", date: "2026-04-23", status: "draft", color: "#1da1f2" },
  { id: "3", title: "Case study website", platform: "linkedin", date: "2026-04-25", status: "scheduled", color: "#0077b5" },
  { id: "4", title: "Reel processo de trabalho", platform: "instagram", date: "2026-04-27", status: "idea", color: "#e1306c" },
];

const platformIcons: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  instagram: Camera,
  twitter: Hash,
  linkedin: Briefcase,
  youtube: Video,
};

const statusMap = {
  scheduled: { label: "Agendado", class: "bg-green-500/20 text-green-500" },
  draft: { label: "Rascunho", class: "bg-yellow-500/20 text-yellow-500" },
  idea: { label: "Ideia", class: "bg-muted text-muted-foreground" },
  published: { label: "Publicado", class: "bg-primary/20 text-primary" },
};

export default function ContentCalendarPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">Calendário de Conteúdo</h1>
            <Badge variant="secondary" className="text-[10px]">BETA</Badge>
          </div>
          <p className="text-muted-foreground text-sm">Planeje seu conteúdo para redes sociais</p>
        </div>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Novo Conteúdo
        </Button>
      </div>

      {/* Weeks */}
      <div className="grid gap-3">
        {["Semana 22 Abr", "Semana 29 Abr"].map((week) => (
          <div key={week}>
            <p className="text-xs font-medium text-muted-foreground mb-2">{week}</p>
            <div className="grid gap-2">
              {posts
                .filter((p) => (week.includes("22") ? parseInt(p.date.split("-")[2]) < 28 : parseInt(p.date.split("-")[2]) >= 28))
                .map((post) => {
                  const Icon = platformIcons[post.platform] ?? Calendar;
                  const cfg = statusMap[post.status as keyof typeof statusMap];
                  return (
                    <Card key={post.id} className="hover:border-primary/50 transition-colors cursor-pointer">
                      <CardContent className="p-3 flex items-center gap-3">
                        <div
                          className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0"
                          style={{ backgroundColor: post.color + "30" }}
                        >
                          <Icon className="h-4 w-4" style={{ color: post.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{post.title}</p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {post.platform} · {new Date(post.date).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.class}`}>
                          {cfg.label}
                        </span>
                      </CardContent>
                    </Card>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

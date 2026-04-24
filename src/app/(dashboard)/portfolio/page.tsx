"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Globe, ExternalLink, Plus, Star, Palette, Image } from "lucide-react";
import { toast } from "sonner";

const projects = [
  { id: "1", title: "Website BL Agency", tags: ["Web", "React"], image: null },
  { id: "2", title: "Identidade SD Branding", tags: ["Design", "Branding"], image: null },
  { id: "3", title: "App Melo Tech", tags: ["Mobile", "React Native"], image: null },
];

const testimonials = [
  { id: "1", name: "Ana Costa", role: "CEO, Studio Ana", content: "Trabalho incrível! Superou todas as expectativas.", rating: 5 },
  { id: "2", name: "Bruno Lima", role: "Designer, BL Agency", content: "Profissionalismo e qualidade exemplares.", rating: 5 },
];

export default function PortfolioPage() {
  const [active, setActive] = useState(true);
  const [openProject, setOpenProject] = useState(false);
  const [openTestimonial, setOpenTestimonial] = useState(false);

  function copyLink() {
    navigator.clipboard.writeText("https://timo.app/p/meu-portfolio");
    toast.success("Link copiado!");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Portfolio Público</h1>
          <p className="text-muted-foreground text-sm">Sua página profissional integrada ao CRM</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={copyLink}>
            <ExternalLink className="mr-2 h-4 w-4" />
            Ver página
          </Button>
        </div>
      </div>

      {/* Status */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Portfolio público</p>
                <p className="text-xs text-muted-foreground">timo.app/p/meu-portfolio</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{active ? "Publicado" : "Rascunho"}</span>
              <Switch checked={active} onCheckedChange={setActive} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info">Informações</TabsTrigger>
          <TabsTrigger value="projects">Projetos</TabsTrigger>
          <TabsTrigger value="testimonials">Depoimentos</TabsTrigger>
          <TabsTrigger value="appearance">Aparência</TabsTrigger>
        </TabsList>

        {/* Info Tab */}
        <TabsContent value="info" className="mt-4">
          <Card>
            <CardHeader><CardTitle>Dados da Página</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Nome / Marca</Label>
                <Input defaultValue="João Silva — Desenvolvedor" />
              </div>
              <div className="space-y-2">
                <Label>Headline</Label>
                <Input defaultValue="Transformo ideias em produtos digitais incríveis" />
              </div>
              <div className="space-y-2">
                <Label>Bio</Label>
                <Textarea
                  defaultValue="Desenvolvedor full-stack com 8 anos de experiência..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>URL Personalizada</Label>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground shrink-0">timo.app/p/</span>
                    <Input defaultValue="joaosilva" className="text-sm" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Layout</Label>
                  <div className="flex gap-2">
                    {["Clássico", "Hoverton PRO"].map((l) => (
                      <button
                        key={l}
                        className="flex-1 rounded-md border border-border px-3 py-1.5 text-xs hover:border-primary transition-colors data-[active=true]:border-primary data-[active=true]:bg-primary/10"
                        data-active={l === "Clássico"}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <Button size="sm">Salvar alterações</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="projects" className="mt-4">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-muted-foreground">{projects.length} projetos</p>
            <Button size="sm" onClick={() => setOpenProject(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Projeto
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <Card key={p.id} className="hover:border-primary/50 transition-colors cursor-pointer">
                <CardContent className="p-0">
                  <div className="h-32 rounded-t-lg bg-muted flex items-center justify-center">
                    <Image className="h-8 w-8 text-muted-foreground/40" aria-label="placeholder de imagem do projeto" />
                  </div>
                  <div className="p-3 space-y-1">
                    <p className="font-medium text-sm">{p.title}</p>
                    <div className="flex flex-wrap gap-1">
                      {p.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-[10px]">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Testimonials Tab */}
        <TabsContent value="testimonials" className="mt-4">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-muted-foreground">{testimonials.length} depoimentos</p>
            <Button size="sm" onClick={() => setOpenTestimonial(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {testimonials.map((t) => (
              <Card key={t.id}>
                <CardContent className="pt-4 space-y-2">
                  <div className="flex">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                  <p className="text-sm italic text-muted-foreground">&quot;{t.content}&quot;</p>
                  <div>
                    <p className="text-sm font-medium">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="mt-4">
          <Card>
            <CardHeader><CardTitle>Personalização Visual</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Cor primária</Label>
                <div className="flex items-center gap-3">
                  <input type="color" defaultValue="#6366f1" className="h-9 w-16 rounded border border-border cursor-pointer" />
                  <Input defaultValue="#6366f1" className="w-28" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Logo</Label>
                <div className="flex items-center gap-3">
                  <div className="h-16 w-16 rounded-lg border border-dashed border-border flex items-center justify-center">
                    <Palette className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <Button variant="outline" size="sm">Enviar logo</Button>
                </div>
              </div>
              <Button size="sm">Salvar aparência</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Project Dialog */}
      <Dialog open={openProject} onOpenChange={setOpenProject}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Adicionar Projeto</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Título *</Label>
              <Input placeholder="Nome do projeto" />
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea placeholder="Sobre o projeto..." rows={2} />
            </div>
            <div className="space-y-2">
              <Label>Tags</Label>
              <Input placeholder="Web, Design, React..." />
            </div>
            <div className="space-y-2">
              <Label>URL do projeto</Label>
              <Input placeholder="https://..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenProject(false)}>Cancelar</Button>
            <Button onClick={() => setOpenProject(false)}>Adicionar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Testimonial Dialog */}
      <Dialog open={openTestimonial} onOpenChange={setOpenTestimonial}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Adicionar Depoimento</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nome *</Label>
                <Input placeholder="Nome do cliente" />
              </div>
              <div className="space-y-2">
                <Label>Cargo / Empresa</Label>
                <Input placeholder="CEO, Empresa X" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Depoimento *</Label>
              <Textarea placeholder="O que o cliente disse..." rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenTestimonial(false)}>Cancelar</Button>
            <Button onClick={() => setOpenTestimonial(false)}>Adicionar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

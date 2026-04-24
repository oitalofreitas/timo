"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Kanban,
  CheckSquare,
  CalendarDays,
  DollarSign,
  Package,
  FileText,
  ClipboardList,
  Globe,
  MessageCircle,
  Settings,
  Bot,
  UserSquare,
  ChevronDown,
  Zap,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const navigation = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Clientes", href: "/clients", icon: Users },
  { label: "Leads & Pipeline", href: "/leads", icon: Kanban },
  {
    label: "Agentes IA",
    icon: Bot,
    children: [
      { label: "Meus Agentes", href: "/agents" },
      { label: "Configurar", href: "/agents/settings" },
    ],
  },
  {
    label: "Tarefas",
    icon: CheckSquare,
    children: [
      { label: "Quadro", href: "/projects" },
      { label: "Conteúdos", href: "/content-calendar", badge: "BETA" },
    ],
  },
  { label: "Agenda", href: "/agenda", icon: CalendarDays },
  { label: "Financeiro", href: "/finance", icon: DollarSign },
  { label: "Serviços", href: "/services", icon: Package },
  { label: "Orçamentos", href: "/quotes", icon: FileText },
  { label: "Briefings", href: "/briefings", icon: ClipboardList },
  { label: "Portfolio", href: "/portfolio", icon: Globe },
  { label: "Equipe", href: "/team", icon: UserSquare },
  { label: "WhatsApp", href: "/whatsapp", icon: MessageCircle },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Zap className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg tracking-tight group-data-[collapsible=icon]:hidden">
            Timo
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => {
                if (item.children) {
                  const isActive = item.children.some((c) => pathname.startsWith(c.href));
                  return (
                    <Collapsible key={item.label} defaultOpen={isActive} className="group/collapsible">
                      <SidebarMenuItem>
                        <CollapsibleTrigger className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors">
                          <item.icon className="h-4 w-4 shrink-0" />
                          <span className="flex-1 text-left group-data-[collapsible=icon]:hidden">{item.label}</span>
                          <ChevronDown className="h-3 w-3 transition-transform group-data-[open]/collapsible:rotate-180 group-data-[collapsible=icon]:hidden" />
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.children.map((child) => (
                              <SidebarMenuSubItem key={child.href}>
                                <SidebarMenuSubButton
                                  render={<Link href={child.href} />}
                                  isActive={pathname === child.href}
                                >
                                  <span>{child.label}</span>
                                  {"badge" in child && child.badge && (
                                    <span className="ml-auto text-[10px] font-semibold bg-primary/20 text-primary px-1.5 rounded">
                                      {child.badge}
                                    </span>
                                  )}
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                }

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      render={<Link href={item.href!} />}
                      tooltip={item.label}
                      isActive={pathname === item.href}
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              render={<Link href="/settings" />}
              tooltip="Configurações"
              isActive={pathname === "/settings"}
            >
              <Settings />
              <span>Configurações</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Minha conta">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                  U
                </AvatarFallback>
              </Avatar>
              <span className="truncate">Minha Conta</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

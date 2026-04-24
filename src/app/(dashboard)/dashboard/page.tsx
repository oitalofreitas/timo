"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  TrendingUp,
  DollarSign,
  Users,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  LayoutGrid,
} from "lucide-react";

const chartData = [
  { month: "Nov", receitas: 8500, despesas: 3200 },
  { month: "Dez", receitas: 12000, despesas: 4100 },
  { month: "Jan", receitas: 9800, despesas: 3800 },
  { month: "Fev", receitas: 14200, despesas: 5200 },
  { month: "Mar", receitas: 11500, despesas: 4300 },
  { month: "Abr", receitas: 16800, despesas: 5900 },
];

const stats = [
  {
    title: "Meta de Receita",
    value: "R$ 16.800",
    goal: 20000,
    current: 16800,
    icon: Target,
    trend: "+12%",
    up: true,
    sub: "Meta: R$ 20.000",
    showProgress: true,
  },
  {
    title: "Faturamento do Mês",
    value: "R$ 16.800",
    icon: DollarSign,
    trend: "+8,3%",
    up: true,
    sub: "R$ 4.200 pendente",
    badge: "Pendente",
  },
  {
    title: "Novos Leads",
    value: "24",
    icon: Users,
    trend: "+4",
    up: true,
    sub: "vs. mês anterior",
  },
  {
    title: "Ticket Médio",
    value: "R$ 2.100",
    icon: TrendingUp,
    trend: "-2,1%",
    up: false,
    sub: "vs. mês anterior",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground text-sm">Visão geral do seu negócio</p>
        </div>
        <Button variant="outline" size="sm">
          <LayoutGrid className="mr-2 h-4 w-4" />
          Editar Layout
        </Button>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {s.title}
              </CardTitle>
              <s.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="flex items-center gap-2 text-xs">
                {s.up ? (
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-500" />
                )}
                <span className={s.up ? "text-green-500" : "text-red-500"}>
                  {s.trend}
                </span>
                <span className="text-muted-foreground">{s.sub}</span>
                {s.badge && (
                  <Badge variant="secondary" className="ml-auto text-[10px]">
                    {s.badge}
                  </Badge>
                )}
              </div>
              {s.showProgress && s.goal && (
                <div className="space-y-1">
                  <Progress value={(s.current / s.goal) * 100} className="h-1.5" />
                  <p className="text-[11px] text-muted-foreground text-right">
                    {Math.round((s.current / s.goal) * 100)}% da meta
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Análise Financeira Consolidada</CardTitle>
            <Badge variant="outline">Últimos 6 meses</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorReceitas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorDespesas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis
                tick={{ fontSize: 12 }}
                stroke="hsl(var(--muted-foreground))"
                tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: 12,
                }}
                formatter={(value) =>
                  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(value))
                }
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="receitas"
                name="Receitas"
                stroke="#6366f1"
                fill="url(#colorReceitas)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="despesas"
                name="Despesas"
                stroke="#f43f5e"
                fill="url(#colorDespesas)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

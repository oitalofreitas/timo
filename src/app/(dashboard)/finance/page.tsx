"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertTriangle,
  ShoppingCart,
  ArrowUpCircle,
} from "lucide-react";
import { formatCurrency } from "@/lib/format";

const transactions = [
  { id: "1", type: "INCOME", description: "Projeto Website — Ana Costa", amount: 4500, status: "PAID", dueDate: "2026-04-10", category: "Serviços" },
  { id: "2", type: "INCOME", description: "Identidade Visual — Bruno Lima", amount: 2800, status: "PENDING", dueDate: "2026-04-20", category: "Serviços" },
  { id: "3", type: "EXPENSE", description: "Adobe CC", amount: 299, status: "PAID", dueDate: "2026-04-05", category: "Software" },
  { id: "4", type: "INCOME", description: "Social Media — Carla Souza", amount: 1200, status: "OVERDUE", dueDate: "2026-04-01", category: "Serviços" },
  { id: "5", type: "EXPENSE", description: "Servidor VPS", amount: 120, status: "PAID", dueDate: "2026-04-15", category: "Infraestrutura" },
  { id: "6", type: "INCOME", description: "App Mobile — Diego Ferreira", amount: 8000, status: "PENDING", dueDate: "2026-04-25", category: "Desenvolvimento" },
];

const chartData = [
  { name: "Jan", receitas: 9800, despesas: 3200 },
  { name: "Fev", receitas: 14200, despesas: 4100 },
  { name: "Mar", receitas: 11500, despesas: 3800 },
  { name: "Abr", receitas: 16800, despesas: 5200 },
];

const statusConfig = {
  PAID: { label: "Pago", class: "bg-green-500/20 text-green-500" },
  PENDING: { label: "Pendente", class: "bg-yellow-500/20 text-yellow-500" },
  OVERDUE: { label: "Vencido", class: "bg-red-500/20 text-red-500" },
  CANCELLED: { label: "Cancelado", class: "bg-muted text-muted-foreground" },
};

export default function FinancePage() {
  const [openIncome, setOpenIncome] = useState(false);
  const [openExpense, setOpenExpense] = useState(false);

  const income = transactions.filter((t) => t.type === "INCOME");
  const expenses = transactions.filter((t) => t.type === "EXPENSE");
  const totalIncome = income.filter((t) => t.status === "PAID").reduce((a, t) => a + t.amount, 0);
  const totalPending = income.filter((t) => t.status === "PENDING").reduce((a, t) => a + t.amount, 0);
  const totalOverdue = transactions.filter((t) => t.status === "OVERDUE").reduce((a, t) => a + t.amount, 0);
  const totalExpenses = expenses.filter((t) => t.status === "PAID").reduce((a, t) => a + t.amount, 0);
  const profit = totalIncome - totalExpenses;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Financeiro</h1>
          <p className="text-muted-foreground text-sm">Controle receitas e despesas</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setOpenExpense(true)}>
            <TrendingDown className="mr-2 h-4 w-4" />
            Lançar Despesa
          </Button>
          <Button size="sm" onClick={() => setOpenIncome(true)}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Venda Rápida
          </Button>
        </div>
      </div>

      {/* Alert overdue */}
      {totalOverdue > 0 && (
        <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>
            Você tem <strong>{formatCurrency(totalOverdue)}</strong> em recebimentos vencidos
          </span>
        </div>
      )}

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Recebido</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-500">{formatCurrency(totalIncome)}</p>
            <p className="text-xs text-muted-foreground mt-1">{formatCurrency(totalPending)} pendente</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Despesas</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-500">{formatCurrency(totalExpenses)}</p>
            <p className="text-xs text-muted-foreground mt-1">pagas este mês</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Lucro Líquido</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(profit)}</p>
            <p className="text-xs text-muted-foreground mt-1">receitas − despesas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Vencidos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-500">{formatCurrency(totalOverdue)}</p>
            <p className="text-xs text-muted-foreground mt-1">requer atenção</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Fluxo de Caixa</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `R$${v / 1000}k`} />
              <Tooltip
                contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12 }}
                formatter={(v) => formatCurrency(Number(v))}
              />
              <Bar dataKey="receitas" name="Receitas" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="despesas" name="Despesas" fill="#f43f5e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Transactions Tabs */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="income">Receber</TabsTrigger>
          <TabsTrigger value="expense">Pagar</TabsTrigger>
        </TabsList>

        {["all", "income", "expense"].map((tab) => {
          const list = tab === "all" ? transactions : transactions.filter((t) => t.type === (tab === "income" ? "INCOME" : "EXPENSE"));
          return (
            <TabsContent key={tab} value={tab}>
              <div className="rounded-md border border-border overflow-hidden">
                {list.map((t, i) => (
                  <div
                    key={t.id}
                    className={`flex items-center gap-4 px-4 py-3 ${i !== 0 ? "border-t border-border" : ""} hover:bg-muted/30`}
                  >
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${t.type === "INCOME" ? "bg-green-500/20" : "bg-red-500/20"}`}>
                      {t.type === "INCOME" ? (
                        <ArrowUpCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{t.description}</p>
                      <p className="text-xs text-muted-foreground">{t.category} · {new Date(t.dueDate).toLocaleDateString("pt-BR")}</p>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusConfig[t.status as keyof typeof statusConfig].class}`}
                    >
                      {statusConfig[t.status as keyof typeof statusConfig].label}
                    </span>
                    <p className={`text-sm font-bold tabular-nums ${t.type === "INCOME" ? "text-green-500" : "text-red-500"}`}>
                      {t.type === "INCOME" ? "+" : "-"}{formatCurrency(t.amount)}
                    </p>
                  </div>
                ))}
              </div>
            </TabsContent>
          );
        })}
      </Tabs>

      {/* Income Dialog */}
      <Dialog open={openIncome} onOpenChange={setOpenIncome}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Venda Rápida</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Descrição *</Label>
              <Input placeholder="Ex: Projeto Website" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Valor *</Label>
                <Input placeholder="R$ 0,00" />
              </div>
              <div className="space-y-2">
                <Label>Vencimento</Label>
                <Input type="date" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Cliente</Label>
              <Select><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Ana Costa</SelectItem>
                  <SelectItem value="2">Bruno Lima</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Input placeholder="Serviços, Produto..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenIncome(false)}>Cancelar</Button>
            <Button onClick={() => setOpenIncome(false)}>Lançar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Expense Dialog */}
      <Dialog open={openExpense} onOpenChange={setOpenExpense}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Lançar Despesa</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Descrição *</Label>
              <Input placeholder="Ex: Adobe CC" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Valor *</Label>
                <Input placeholder="R$ 0,00" />
              </div>
              <div className="space-y-2">
                <Label>Vencimento</Label>
                <Input type="date" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Input placeholder="Software, Infraestrutura..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenExpense(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={() => setOpenExpense(false)}>Lançar Despesa</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

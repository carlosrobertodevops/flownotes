"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { NotebookPen, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useAuth();
  const { theme, setTheme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/auth/${isLogin ? "login" : "register"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isLogin ? { email, password } : { name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data.user);
        toast.success(isLogin ? "Login bem-sucedido!" : "Conta criada com sucesso!");
        router.push("/");
      } else {
        toast.error(data.error || "Ocorreu um erro");
      }
    } catch (err) {
      toast.error("Erro de rede");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-transparent transition-colors duration-500">
      {/* Botão de Tema */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 z-50 rounded-full bg-background/50 backdrop-blur-sm border border-border"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-zinc-800 dark:text-zinc-200" />
        <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-zinc-800 dark:text-zinc-200" />
        <span className="sr-only">Toggle theme</span>
      </Button>

      {/* Lado Esquerdo - Propaganda (Cor suave com grid) */}
      <div className="hidden lg:flex w-1/2 flex-col justify-center items-center relative overflow-hidden transition-all duration-700 bg-background/10 backdrop-blur-2xl border-r border-border p-10 text-center">
        <div className="absolute left-16 top-20 h-64 w-64 rounded-full bg-sky-400/20 blur-[140px]" />
        <div className="absolute bottom-20 right-24 h-80 w-80 rounded-full bg-emerald-400/14 blur-[140px]" />
        
        <div className="relative z-10 w-full flex flex-col items-center justify-center gap-4 mt-10">
            <span className="rounded-xl border border-sky-400/30 bg-sky-400/10 p-4 text-sky-500 shadow-glow">
              <NotebookPen size={40} />
            </span>
            <div>
              <p className="text-sm text-sky-500 font-medium mb-2">flownotes</p>
              <h1 className="text-4xl font-semibold tracking-tight text-foreground">Suas ideias no seu ritmo</h1>
            </div>
        </div>

        <div className="relative z-10 text-center w-full mt-8 max-w-xl mx-auto">
          <p className="text-lg leading-8 text-muted-foreground transition-all duration-700 delay-300">
            Crie, edite, organize e compartilhe suas notas em um ambiente focado, projetado para desenvolvedores e criadores.
          </p>
        </div>

        <div className="relative z-10 grid max-w-2xl gap-4 w-full mt-12 mb-10 mx-auto">
          {[
            ["Foco total", "Um ambiente dark mode nativo para evitar distrações."],
            ["Organização fluida", "Arraste e solte suas notas para priorizar o que importa."],
            ["Compartilhamento simples", "Colabore com outras pessoas através do e-mail de forma segura."],
          ].map(([title, text], index) => (
            <div
              key={title}
              className="p-5 animate-float-in rounded-lg border border-border bg-card/70 shadow-sm backdrop-blur-xl flex flex-col items-center text-center gap-2"
              style={{ animationDelay: `${index * 90}ms` }}
            >
              <span className="h-2 w-2 rounded-full bg-sky-400 shadow-glow animate-pulse-line shrink-0 mb-2" />
              <h2 className="font-semibold text-foreground">{title}</h2>
              <p className="text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Lado Direito - Auth */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-4 sm:p-8 relative">
        <div className="w-full max-w-md">
          <div className="mb-5 flex items-center justify-between lg:justify-end">
            <div className="flex items-center gap-2 lg:hidden">
              <NotebookPen className="text-sky-500" size={24} />
              <span className="text-lg font-semibold">flownotes</span>
            </div>
          </div>

          <Card className="p-5 sm:p-6 glass-card glow-border transition-all duration-500 border-border">
            <div className="mb-6">
              <p className="text-sm text-sky-500 font-medium">
                {isLogin ? "Entrar" : "Cadastro"}
              </p>
              <h2 className="text-2xl font-semibold tracking-tight mt-1 text-foreground">
                {isLogin ? "Acesse seu painel" : "Crie sua conta"}
              </h2>
            </div>

            <div className="mb-5 grid grid-cols-2 rounded-lg border border-border bg-muted/30 p-1">
              <button
                type="button"
                className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                  isLogin ? "bg-sky-500 text-white shadow-glow" : "text-muted-foreground"
                }`}
                onClick={() => {
                  setIsLogin(true);
                  setName("");
                  setPassword("");
                }}
              >
                Login
              </button>
              <button
                type="button"
                className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                  !isLogin ? "bg-sky-500 text-white shadow-glow" : "text-muted-foreground"
                }`}
                onClick={() => {
                  setIsLogin(false);
                  setName("");
                  setPassword("");
                }}
              >
                Cadastro
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-4">
              {!isLogin && (
                <div className="space-y-2 animate-float-in">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    autoComplete="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full mt-2">
                {loading ? "Aguarde..." : isLogin ? "Entrar" : "Criar conta"}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}

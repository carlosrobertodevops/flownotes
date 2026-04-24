"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { NotebookPen, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, logout, setUser } = useAuth();
  const router = useRouter();
  
  const [name, setName] = useState(user?.name || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, currentPassword, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Perfil atualizado com sucesso");
        if (user) {
            setUser({ ...user, name });
        }
        setCurrentPassword("");
        setNewPassword("");
      } else {
        toast.error(data.error || "Falha ao atualizar perfil");
      }
    } catch (err) {
      toast.error("Erro de rede");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="h-16 border-b border-border bg-background/60 backdrop-blur-xl flex items-center px-6 shrink-0 z-50">
        <Button variant="ghost" size="icon" onClick={() => router.push("/")} className="mr-4 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <NotebookPen className="w-6 h-6 text-primary" />
          <span className="font-bold text-xl tracking-tight hidden sm:inline-block text-foreground">flownotes</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 md:p-8 flex items-center justify-center relative">
        <Card className="w-full max-w-md shadow-2xl glass-card glow-border border-border">
          <CardHeader className="space-y-2 text-center pb-6">
            <CardTitle className="text-2xl font-bold tracking-tight text-foreground">Seu Perfil</CardTitle>
            <CardDescription className="text-muted-foreground">
              Atualize suas informações pessoais e senha.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail (Somente leitura)</Label>
                <Input
                  id="email"
                  type="email"
                  value={user.email}
                  disabled
                  className="bg-muted/30 border-border opacity-50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-muted/30 border-border focus:bg-background"
                />
              </div>
              
              <div className="pt-4 border-t border-border">
                <Label className="block mb-2 text-muted-foreground">Mudar Senha (Opcional)</Label>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="currentPassword">Senha Atual</Label>
                        <Input
                        id="currentPassword"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="bg-muted/30 border-border focus:bg-background"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="newPassword">Nova Senha</Label>
                        <Input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="bg-muted/30 border-border focus:bg-background"
                        />
                    </div>
                </div>
              </div>
              
              <Button type="submit" className="w-full mt-6 shadow-glow" disabled={loading}>
                {loading ? "Atualizando..." : "Salvar Alterações"}
              </Button>
            </form>
            
            <div className="mt-8 pt-4 border-t border-border text-center">
                 <Button variant="ghost" className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={logout}>
                    Sair
                 </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

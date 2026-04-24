"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { Note, NoteCard } from "@/components/note-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { NotebookPen, Plus, Search, User, LogOut, Settings } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false }
);

export default function Dashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [readNotes, setReadNotes] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState("");
  const [readFilter, setReadFilter] = useState<"all" | "read" | "unread">("all");
  
  // Modals state
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  
  // Current editing state
  const [currentNote, setCurrentNote] = useState<Partial<Note> | null>(null);
  const [shareEmail, setShareEmail] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user]);

  const fetchNotes = async () => {
    try {
      const res = await fetch("/api/notes");
      if (res.ok) {
        const data = await res.json();
        const incomingNotes = data.notes as Note[];
        setNotes(incomingNotes);
        setReadNotes(
          Object.fromEntries(incomingNotes.map((note) => [note.id, Boolean(note.read)]))
        );
      }
    } catch (err) {
      toast.error("Falha ao carregar notas");
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setNotes((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        const newOrder = arrayMove(items, oldIndex, newIndex);
        
        // Save new order to backend
        saveOrder(newOrder.map(n => n.id));
        return newOrder;
      });
    }
  };

  const saveOrder = async (orderedIds: string[]) => {
    try {
      await fetch("/api/notes/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds }),
      });
    } catch (err) {
      toast.error("Failed to save order");
    }
  };

  const handleSaveNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentNote?.title) {
      toast.error("Título é obrigatório");
      return;
    }

    try {
      const isEditing = !!currentNote.id;
      const url = isEditing ? `/api/notes/${currentNote.id}` : "/api/notes";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentNote),
      });

      if (res.ok) {
        toast.success(isEditing ? "Nota atualizada" : "Nota criada");
        setIsNoteModalOpen(false);
        fetchNotes();
      } else {
        const data = await res.json();
        toast.error(data.error || "Falha ao salvar nota");
      }
    } catch (err) {
      toast.error("Erro de rede");
    }
  };

  const handleDeleteNote = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta nota?")) return;
    
    try {
      const res = await fetch(`/api/notes/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Nota excluída");
        setNotes(notes.filter(n => n.id !== id));
        setReadNotes((prev) => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
      } else {
        toast.error("Falha ao excluir nota");
      }
    } catch (err) {
      toast.error("Erro de rede");
    }
  };

  const handleShareNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shareEmail || !currentNote?.id) return;

    try {
      const res = await fetch(`/api/notes/${currentNote.id}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: shareEmail }),
      });

      if (res.ok) {
        toast.success("Nota compartilhada com sucesso");
        setIsShareModalOpen(false);
        setShareEmail("");
      } else {
        const data = await res.json();
        toast.error(data.error || "Falha ao compartilhar nota");
      }
    } catch (err) {
      toast.error("Erro de rede");
    }
  };

  const searchedNotes = notes.filter(n => 
    n.title.toLowerCase().includes(search.toLowerCase()) || 
    n.content.toLowerCase().includes(search.toLowerCase())
  );

  const filteredNotes = searchedNotes.filter((note) => {
    if (readFilter === "read") return Boolean(readNotes[note.id]);
    if (readFilter === "unread") return !Boolean(readNotes[note.id]);
    return true;
  });

  const readCount = searchedNotes.filter((note) => Boolean(readNotes[note.id])).length;
  const unreadCount = searchedNotes.length - readCount;

  const toggleReadNote = async (id: string) => {
    const previousValue = Boolean(readNotes[id]);
    const nextValue = !previousValue;

    setReadNotes((prev) => ({ ...prev, [id]: nextValue }));

    try {
      const res = await fetch(`/api/notes/${id}/read`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: nextValue }),
      });

      if (!res.ok) {
        setReadNotes((prev) => ({ ...prev, [id]: previousValue }));
        const data = await res.json().catch(() => null);
        toast.error(data?.error || "Falha ao atualizar leitura");
      }
    } catch {
      setReadNotes((prev) => ({ ...prev, [id]: previousValue }));
      toast.error("Erro ao atualizar leitura");
    }
  };

  if (!user) return null; // Let AuthProvider handle redirect

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="h-16 border-b border-border bg-background/60 backdrop-blur-xl flex items-center px-6 justify-between shrink-0 z-50">
        <div className="flex items-center gap-2">
          <NotebookPen className="w-6 h-6 text-primary" />
          <span className="font-bold text-xl tracking-tight hidden sm:inline-block text-foreground">flownotes</span>
        </div>
        
        <div className="flex-1 max-w-md px-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Pesquisar notas..." 
              className="pl-9 bg-muted/30 border-border w-full focus:bg-background"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/profile")} className="text-muted-foreground hover:text-foreground">
            <User className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={logout} className="text-destructive hover:bg-destructive/10 hover:text-destructive">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-4 mb-8 lg:flex-row lg:items-center lg:justify-between">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <span>Minhas Notas</span>
              <span className="inline-flex items-center rounded-md border border-border bg-muted/40 px-2 py-0.5 text-sm font-medium text-muted-foreground">
                {filteredNotes.length}
              </span>
            </h1>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/20 p-1">
                <Button
                  type="button"
                  size="sm"
                  variant={readFilter === "all" ? "default" : "ghost"}
                  className={readFilter === "all" ? "shadow-glow" : "text-muted-foreground"}
                  onClick={() => setReadFilter("all")}
                >
                  Todas ({searchedNotes.length})
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={readFilter === "read" ? "default" : "ghost"}
                  className={readFilter === "read" ? "bg-emerald-500/85 hover:bg-emerald-500 text-white" : "text-muted-foreground"}
                  onClick={() => setReadFilter("read")}
                >
                  Lidas ({readCount})
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={readFilter === "unread" ? "default" : "ghost"}
                  className={readFilter === "unread" ? "shadow-glow" : "text-muted-foreground"}
                  onClick={() => setReadFilter("unread")}
                >
                  Não lidas ({unreadCount})
                </Button>
              </div>

              <Button onClick={() => { setCurrentNote({ title: "", content: "" }); setIsNoteModalOpen(true); }} className="gap-2">
                <Plus className="h-4 w-4" /> Nova Nota
              </Button>
            </div>
          </div>

          {filteredNotes.length === 0 ? (
            <div className="text-center py-20 bg-muted/20 rounded-xl border border-border border-dashed backdrop-blur-sm">
              <NotebookPen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-medium text-foreground">Nenhuma nota encontrada</h3>
              <p className="text-muted-foreground mt-2 mb-6">Crie uma nova nota para começar.</p>
              <Button onClick={() => { setCurrentNote({ title: "", content: "" }); setIsNoteModalOpen(true); }} className="shadow-glow">
                Criar Nota
              </Button>
            </div>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={filteredNotes.map(n => n.id)} strategy={rectSortingStrategy}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
                  {filteredNotes.map((note) => (
                    <NoteCard 
                      key={note.id} 
                      note={note} 
                      isRead={Boolean(readNotes[note.id])}
                      onEdit={(n) => { setCurrentNote(n); setIsNoteModalOpen(true); }}
                      onDelete={handleDeleteNote}
                      onShare={(n) => { setCurrentNote(n); setIsShareModalOpen(true); }}
                      onToggleRead={toggleReadNote}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      </main>

      {/* Create/Edit Note Modal */}
      <Dialog open={isNoteModalOpen} onOpenChange={setIsNoteModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{currentNote?.id ? "Editar Nota" : "Criar Nota"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveNote} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input 
                id="title" 
                value={currentNote?.title || ""} 
                onChange={(e) => setCurrentNote(prev => ({ ...prev, title: e.target.value }))}
                className="bg-muted/30 border-border text-lg font-medium focus:bg-background"
                placeholder="Título da nota"
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Conteúdo</Label>
              <div data-color-mode="dark" className="border border-border rounded-md overflow-hidden">
                <MDEditor
                  value={currentNote?.content || ""}
                  onChange={(val) => setCurrentNote(prev => ({ ...prev, content: val || "" }))}
                  preview="edit"
                  height={300}
                  className="bg-muted/30 !bg-transparent"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setIsNoteModalOpen(false)}>Cancelar</Button>
              <Button type="submit" className="shadow-glow">Salvar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Share Note Modal */}
      <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Compartilhar Nota</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleShareNote} className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">Compartilhar "{currentNote?.title}" com outro usuário.</p>
            <div className="space-y-2">
              <Label htmlFor="share-email">Email do Usuário</Label>
              <Input 
                id="share-email" 
                type="email"
                value={shareEmail} 
                onChange={(e) => setShareEmail(e.target.value)}
                className="bg-muted/30 border-border focus:bg-background"
                placeholder="user@example.com"
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setIsShareModalOpen(false)}>Cancelar</Button>
              <Button type="submit" className="shadow-glow">Compartilhar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

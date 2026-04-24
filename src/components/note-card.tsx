import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, GripVertical, Share2, CheckCheck } from "lucide-react";
import MDEditor from "@uiw/react-md-editor";

export type Note = {
  id: string;
  title: string;
  content: string;
  order: number;
  read?: boolean;
  createdAt: string;
  updatedAt: string;
};

type NoteCardProps = {
  note: Note;
  isRead: boolean;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  onShare: (note: Note) => void;
  onToggleRead: (id: string) => void;
};

const NOTE_CARD_THEMES = [
  {
    card: "border-sky-400/40 hover:border-sky-400/75 before:border-sky-300/25",
    ribbon: "from-sky-400/70 to-cyan-300/40",
  },
  {
    card: "border-violet-400/40 hover:border-violet-400/70 before:border-violet-300/20",
    ribbon: "from-violet-400/70 to-fuchsia-300/40",
  },
  {
    card: "border-amber-400/40 hover:border-amber-400/70 before:border-amber-300/20",
    ribbon: "from-amber-400/70 to-orange-300/40",
  },
  {
    card: "border-rose-400/35 hover:border-rose-400/70 before:border-rose-300/20",
    ribbon: "from-rose-400/70 to-pink-300/40",
  },
  {
    card: "border-indigo-400/35 hover:border-indigo-400/70 before:border-indigo-300/20",
    ribbon: "from-indigo-400/70 to-blue-300/40",
  },
  {
    card: "border-teal-400/35 hover:border-teal-400/70 before:border-teal-300/20",
    ribbon: "from-teal-400/70 to-emerald-300/40",
  },
] as const;

const READ_CARD_THEME = {
  card: "!border-emerald-400/85 hover:!border-emerald-400/95 before:!border-emerald-300/35",
  ribbon: "from-emerald-400/80 to-green-300/45",
};

function colorIndexFromId(id: string) {
  return id
    .split("")
    .reduce((acc, char, index) => acc + char.charCodeAt(0) * (index + 1), 0) % NOTE_CARD_THEMES.length;
}

export function NoteCard({ note, isRead, onEdit, onDelete, onShare, onToggleRead }: NoteCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: note.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  };

  const theme = isRead ? READ_CARD_THEME : NOTE_CARD_THEMES[colorIndexFromId(note.id)];

  return (
    <div ref={setNodeRef} style={style} className="relative group h-full">
      <Card className={`h-full min-h-[270px] flex flex-col cursor-default ${theme.card}`}>
        <div className={`pointer-events-none absolute inset-x-4 top-0 h-1 rounded-full bg-gradient-to-r ${theme.ribbon}`} />
        <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-2 overflow-hidden w-full">
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab hover:bg-primary/10 p-1 rounded-md text-muted-foreground hover:text-primary transition-colors shrink-0"
            >
              <GripVertical className="h-4 w-4" />
            </div>
            <CardTitle className="truncate text-lg font-semibold">{note.title}</CardTitle>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onToggleRead(note.id)}
            className={isRead ? "ml-2 h-8 px-2 text-emerald-300 hover:text-emerald-200 hover:bg-emerald-500/10" : "ml-2 h-8 px-2 text-muted-foreground hover:text-foreground hover:bg-muted/40"}
            aria-pressed={isRead}
          >
            <CheckCheck className="h-4 w-4" />
            <span className="ml-1 text-xs font-medium">{isRead ? "Lido" : "Marcar"}</span>
          </Button>
        </CardHeader>
        <CardContent className="p-4 pt-2 flex-grow overflow-hidden relative">
          <div data-color-mode="dark" className="text-sm line-clamp-6 mask-image-bottom-blur">
            <MDEditor.Markdown source={note.content} className="!bg-transparent text-muted-foreground" />
          </div>
        </CardContent>
        <CardFooter className="p-3 pt-0 flex justify-between items-center bg-muted/10 mt-auto border-t border-border opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="text-xs text-muted-foreground">
            {new Date(note.createdAt).toLocaleDateString()}
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10" onClick={() => onShare(note)}>
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10" onClick={() => onEdit(note)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => onDelete(note.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

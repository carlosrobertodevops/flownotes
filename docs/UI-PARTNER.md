# UI Partner Guide

## 1. Cores e Tema (Tailwind v4 Variables)

### Light Mode

- **Background**: `hsl(210 40% 98%)` (Cinza muito claro/quase branco)
- **Foreground**: `hsl(222 47% 11%)` (Texto escuro)
- **Primary**: `hsl(199 89% 48%)` (Azul brilhante - #0EA5E9 / sky-500)
- **Card**: `hsl(0 0% 100%)` (Branco puro)
- **Muted**: `hsl(210 40% 93%)`
- **Border/Input**: `hsl(214 32% 86%)`

### Dark Mode

- **Background**: `hsl(222 47% 7%)` (Fundo bem escuro, levemente azulado)
- **Foreground**: `hsl(210 40% 96%)` (Texto claro)
- **Primary**: `hsl(199 89% 55%)` (Azul brilhante para dark mode)
- **Card**: `hsl(222 47% 10%)`
- **Muted**: `hsl(217 33% 14%)`
- **Border/Input**: `hsl(217 33% 20%)`

### Efeitos de Cor

- **Glow Shadow**: `0 0 32px rgba(56, 189, 248, 0.22)` (Brilho azul)
- Uso intensivo de transparências e blur (ex: `bg-background/60 backdrop-blur-xl`) para dar efeito de vidro.

---

## 2. Tipografia

- Fontes modernas e sem serifa (Geist Sans / Geist Mono como base no Next.js).
- Textos principais e cabeçalhos com `tracking-tight` (Letter spacing ligeiramente reduzido).
- Textos descritivos e placeholders utilizando a cor `muted-foreground`.

---

## 3. Elementos de Interface

### Cards e Dialogs (Glassmorphism)

- Os contêineres principais utilizam um estilo "Glass" (vidro).
- **Classes Padrão**: `rounded-xl border border-border bg-card/70 shadow-sm backdrop-blur-xl`.
- Para o efeito especial em destaque (ex: login/profile): usar a classe `.glass-card`.
- **Efeito Hover e Borda**:
  - Cards que representam itens clicáveis têm uma animação suave: `transition duration-300 hover:-translate-y-0.5 hover:shadow-glow`.
  - Cards de destaque utilizam a classe animada `.glow-border` (Borda animada que gira no card).

### Fundo (Background)

- A aplicação utiliza um grid sutil desenhado em CSS.
- **Implementação**:
  ```css
  .bg-grid {
    background-size: 40px 40px;
    background-image:
      linear-gradient(to right, rgba(128, 128, 128, 0.1) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(128, 128, 128, 0.1) 1px, transparent 1px);
    mask-image: linear-gradient(to bottom, black 40%, transparent 100%);
  }
  ```
- Bolhas de desfoque coloridas (`blur-3xl`) podem ser adicionadas atrás do conteúdo para dar cor ao fundo escuro (ex: `bg-sky-400/20`).

### Botões e Inputs

- **Inputs**: Fundos semi-transparentes (`bg-muted/30`) que ficam sólidos no focus (`focus:bg-background`). Sem anéis pesados de foco por padrão na maioria dos casos, usando cores de borda para destacar.
- **Botões Primários**: Azul brilhante, utilizando `shadow-glow` para se destacar.

---

## 4. Animações

- **Spin Border** (`.glow-border`): Uma borda em gradiente que rotaciona 360 graus constantemente atrás do elemento, mas que só fica visível (opacity: 1) no hover.
- **Float In**: Itens de lista aparecendo de baixo para cima (`translateY(14px) scale(.98)` para `translateY(0) scale(1)` com `opacity`).
- **Pulse Line**: Linhas ou pontinhos de destaque pulsando a opacidade suavemente (`opacity .28` a `.72`).

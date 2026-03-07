import { useState } from "react";
import {
  User, Cat, Dog, Bird, Fish, Rabbit, Squirrel, Bug,
  Smile, Heart, Star, Zap, Flame, Crown, Ghost, Skull,
  Rocket, Gamepad2, Music, Palette, Coffee, Pizza,
  Sun, Moon, TreePine, Flower2,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { motion } from "framer-motion";

export const AVATAR_OPTIONS = [
  { id: "user", icon: User, label: "Persona" },
  { id: "smile", icon: Smile, label: "Sorriso" },
  { id: "heart", icon: Heart, label: "Cuore" },
  { id: "star", icon: Star, label: "Stella" },
  { id: "zap", icon: Zap, label: "Fulmine" },
  { id: "flame", icon: Flame, label: "Fiamma" },
  { id: "crown", icon: Crown, label: "Corona" },
  { id: "ghost", icon: Ghost, label: "Fantasma" },
  { id: "skull", icon: Skull, label: "Teschio" },
  { id: "rocket", icon: Rocket, label: "Razzo" },
  { id: "gamepad", icon: Gamepad2, label: "Gioco" },
  { id: "music", icon: Music, label: "Musica" },
  { id: "palette", icon: Palette, label: "Arte" },
  { id: "coffee", icon: Coffee, label: "Caffè" },
  { id: "pizza", icon: Pizza, label: "Pizza" },
  { id: "sun", icon: Sun, label: "Sole" },
  { id: "moon", icon: Moon, label: "Luna" },
  { id: "tree", icon: TreePine, label: "Albero" },
  { id: "flower", icon: Flower2, label: "Fiore" },
  { id: "cat", icon: Cat, label: "Gatto" },
  { id: "dog", icon: Dog, label: "Cane" },
  { id: "bird", icon: Bird, label: "Uccello" },
  { id: "fish", icon: Fish, label: "Pesce" },
  { id: "rabbit", icon: Rabbit, label: "Coniglio" },
  { id: "squirrel", icon: Squirrel, label: "Scoiattolo" },
  { id: "bug", icon: Bug, label: "Insetto" },
] as const;

export type AvatarId = (typeof AVATAR_OPTIONS)[number]["id"];

export const getAvatarIcon = (id: string) => {
  return AVATAR_OPTIONS.find((a) => a.id === id)?.icon || User;
};

interface AvatarPickerProps {
  selectedId: string;
  onSelect: (id: AvatarId) => void;
}

const AvatarPicker = ({ selectedId, onSelect }: AvatarPickerProps) => {
  const [open, setOpen] = useState(false);
  const SelectedIcon = getAvatarIcon(selectedId);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <motion.button
          className="relative w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-3 group"
          whileTap={{ scale: 0.95 }}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <SelectedIcon size={36} className="text-primary" />
          <div className="absolute inset-0 rounded-full bg-foreground/0 group-hover:bg-foreground/5 transition-colors flex items-center justify-center">
            <span className="text-[10px] font-medium text-foreground/0 group-hover:text-foreground/60 transition-colors">
              Cambia
            </span>
          </div>
        </motion.button>
      </DialogTrigger>
      <DialogContent className="max-w-sm rounded-2xl" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="text-center">Scegli il tuo avatar</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-5 gap-2 pt-2">
          {AVATAR_OPTIONS.map((avatar) => {
            const Icon = avatar.icon;
            const isSelected = avatar.id === selectedId;
            return (
              <motion.button
                key={avatar.id}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  onSelect(avatar.id);
                  setOpen(false);
                }}
                className={`flex flex-col items-center gap-1 p-2.5 rounded-xl transition-colors ${
                  isSelected
                    ? "bg-primary/15 ring-2 ring-primary"
                    : "bg-muted/50 hover:bg-muted"
                }`}
              >
                <Icon size={24} className={isSelected ? "text-primary" : "text-foreground/70"} />
                <span className="text-[9px] font-medium leading-tight text-muted-foreground">
                  {avatar.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AvatarPicker;

import React, { useState } from "react";
import { FaStar, FaPaintBrush } from "react-icons/fa";
import { SketchPicker } from "react-color";
import styles from "./Note.module.scss";

interface INoteForm {
  title: string;
  description: string;
  initialColor: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onChangeColor: (color: string) => void;
  placeholder: string;
  onSubmit: (note: string) => void; // Adicionando a propriedade onSubmit
}

const NoteForm: React.FC<INoteForm> = ({
  title,
  description,
  initialColor,
  isFavorite,
  onToggleFavorite,
  onChangeColor,
  placeholder,
  onSubmit, // Adicionando a propriedade onSubmit
}) => {
  const [color, setColor] = useState(initialColor);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [note, setNote] = useState("");

  const handleColorChange = (newColor: any) => {
    setColor(newColor.hex);
    onChangeColor(newColor.hex);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (note.trim()) {
      onSubmit(note);
      setNote("");
    }
  };

  return (
    <div className={styles.note} style={{ backgroundColor: color }}>
      <div className={styles.header}>
        <h2>{title}</h2>
        <div className={styles.icons}>
          <FaStar
            className={styles.favoriteIcon}
            style={{ color: isFavorite ? "yellow" : "gray" }}
            onClick={onToggleFavorite}
          />
          <FaPaintBrush
            className={styles.paintIcon}
            onClick={() => setShowColorPicker(!showColorPicker)}
          />
        </div>
      </div>
      <div className={styles.content}>
        <p>{description}</p>
      </div>
      {showColorPicker && (
        <div className={styles.colorPicker}>
          <SketchPicker color={color} onChange={handleColorChange} />
        </div>
      )}
      {/* Formulário com placeholder e envio de nota */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder={placeholder}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          style={{ padding: "0.5rem", width: "100%", marginTop: "10px" }}
        />
        <button type="submit" style={{ marginTop: "10px", padding: "0.5rem" }}>
          Adicionar Nota
        </button>
      </form>
    </div>
  );
};

export default NoteForm;

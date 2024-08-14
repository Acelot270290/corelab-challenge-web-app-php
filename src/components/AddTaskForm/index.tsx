import React, { useState } from "react";
import { FaStar, FaPaintBrush, FaSpinner } from "react-icons/fa";
import { SketchPicker } from "react-color";
import styles from "./AddTaskForm.module.scss";

interface IAddTaskForm {
  onSubmit: (newTask: { title: string; description: string; is_favorite: boolean; color: string; }) => void;
  submitting: boolean; // Adicionando prop para gerenciar o estado de envio
}

const AddTaskForm: React.FC<IAddTaskForm> = ({ onSubmit, submitting }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [color, setColor] = useState("#FFFFFF");
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit({ title, description, is_favorite: isFavorite, color });
    resetForm(); // Reseta o formulário após o envio
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setIsFavorite(false);
    setColor("#FFFFFF");
    setShowColorPicker(false);
  };

  const handleColorChange = (newColor: any) => {
    setColor(newColor.hex);
  };

  const confirmColorSelection = () => {
    setShowColorPicker(false); // Fecha a paleta de cores
  };

  return (
    <form onSubmit={handleSubmit} className={styles.taskForm} style={{ backgroundColor: color }}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Título"
        required
        disabled={submitting} // Desabilita o campo enquanto está enviando
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Criar nota..."
        required
        disabled={submitting} // Desabilita o campo enquanto está enviando
      />
      <div className={styles.icons}>
        <FaStar
          className={styles.favoriteIcon}
          style={{ color: isFavorite ? "yellow" : "gray" }}
          onClick={() => setIsFavorite(!isFavorite)}
        />
        <FaPaintBrush
          className={styles.paintIcon}
          onClick={() => setShowColorPicker(!showColorPicker)}
        />
        <button type="submit" className={styles.saveButton} disabled={submitting}>
          {submitting ? <FaSpinner className={styles.spinner} /> : "Salvar"}
        </button>
      </div>
      {showColorPicker && (
        <div className={styles.colorPicker}>
          <SketchPicker color={color} onChange={handleColorChange} />
          <button type="button" onClick={confirmColorSelection}>
            Selecionar esta cor
          </button>
        </div>
      )}
    </form>
  );
};

export default AddTaskForm;

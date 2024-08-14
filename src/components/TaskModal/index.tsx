import React, { useState, useEffect } from "react";
import { ITask } from "../../types/Task";
import styles from "./TaskModal.module.scss";
import { updateTask } from "../../lib/api";
import { FaSpinner } from "react-icons/fa"; // Importando o ícone de spinner

interface TaskModalProps {
  task: ITask | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedTask: ITask) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ task, isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [color, setColor] = useState("#FFFFFF");
  const [isSaving, setIsSaving] = useState(false); // Estado para controlar o spinner

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setIsFavorite(task.is_favorite);
      setColor(task.color);
    }
  }, [task]);

  const handleSave = async () => {
    if (task) {
      setIsSaving(true); // Ativa o spinner
      const updatedTask = { ...task, title, description, is_favorite: isFavorite, color };
      try {
        await updateTask(task.id, updatedTask);
        onSave(updatedTask);
        onClose();
      } catch (error) {
        console.error("Erro ao atualizar a tarefa", error);
      } finally {
        setIsSaving(false); // Desativa o spinner
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Editar Tarefa</h2>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descrição"
          required
        />
        <div className={styles.icons}>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
          <label>
            <input
              type="checkbox"
              checked={isFavorite}
              onChange={() => setIsFavorite(!isFavorite)}
            />
            Favorito
          </label>
        </div>
        <button onClick={handleSave} disabled={isSaving}>
          {isSaving ? <FaSpinner className={styles.spinner} /> : "Salvar"}
        </button>
        <button onClick={onClose} disabled={isSaving}>Cancelar</button>
      </div>
    </div>
  );
};

export default TaskModal;

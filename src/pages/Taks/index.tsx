import React, { useEffect, useState } from "react";
import { getTasks, createTask, toggleFavoriteTask, changeTaskColor, deleteTask as deleteTaskAPI, searchTasks } from "../../lib/api";
import { AddTaskForm, Card, Search, TaskModal } from "../../components";
import Header from "../../components/Header";
import styles from "./Task.module.scss";
import { ITask } from "../../types/Task";
import { FaSpinner } from "react-icons/fa";
import Swal from "sweetalert2";

const TaskPage = () => {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [updatingTaskId, setUpdatingTaskId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [taskToEdit, setTaskToEdit] = useState<ITask | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async (query = "") => {
    setLoading(true);
    try {
      const payload = query ? await searchTasks(query) : await getTasks();
      setTasks(payload);
    } catch (error) {
      Swal.fire("Erro", "Ocorreu um erro ao buscar as tarefas.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleSearchSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    fetchTasks(search);
  };

  const handleNoteSubmit = async (newTask: { title: string; description: string; is_favorite: boolean; color: string; }) => {
    setSubmitting(true);
    try {
      await createTask(newTask);
      fetchTasks();
      Swal.fire("Sucesso", "A tarefa foi criada.", "success");
    } catch (error) {
      Swal.fire("Erro", "Ocorreu um erro ao tentar criar a tarefa.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditTask = (task: ITask) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = async (updatedTask: ITask) => {
    try {
      const updatedTasks = tasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      );
      setTasks(updatedTasks);
      setIsModalOpen(false);
      Swal.fire("Sucesso", "A tarefa foi atualizada.", "success");
    } catch (error) {
      Swal.fire("Erro", "Ocorreu um erro ao tentar atualizar a tarefa.", "error");
    }
  };

  const handleDeleteTask = async (id: number) => {
    if (updatingTaskId) return;
    const result = await Swal.fire({
      title: "Deseja deletar esta tarefa?",
      text: "Você não poderá reverter esta ação!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, deletar",
      cancelButtonText: "Não"
    });

    if (result.isConfirmed) {
      try {
        await deleteTaskAPI(id);
        const updatedTasks = tasks.filter(task => task.id !== id);
        setTasks(updatedTasks);
        Swal.fire("Deletado!", "A tarefa foi deletada com sucesso.", "success");
      } catch (error) {
        Swal.fire("Erro", "Ocorreu um erro ao tentar deletar a tarefa.", "error");
      }
    }
  };

  const changeTaskColorHandler = async (id: number, color: string) => {
    setUpdatingTaskId(id);
    const result = await Swal.fire({
      title: "Deseja alterar a cor da tarefa?",
      text: "A alteração da cor não poderá ser desfeita!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, alterar cor",
      cancelButtonText: "Não",
    });

    if (result.isConfirmed) {
      try {
        await changeTaskColor(id, color);
        const updatedTasks = tasks.map((task) =>
          task.id === id ? { ...task, color } : task
        );
        setTasks(updatedTasks);
        Swal.fire("Sucesso", "A cor da tarefa foi alterada.", "success");
      } catch (error) {
        Swal.fire("Erro", "Ocorreu um erro ao tentar alterar a cor.", "error");
      } finally {
        setUpdatingTaskId(null);
      }
    } else {
      setUpdatingTaskId(null);
    }
  };

  const toggleFavorite = async (id: number) => {
    setUpdatingTaskId(id);

    const task = tasks.find(task => task.id === id);
    if (!task) return;

    const action = task.is_favorite
      ? "remover das favoritas"
      : "adicionar às favoritas";

    const result = await Swal.fire({
      title: `Deseja ${action}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim",
      cancelButtonText: "Não",
    });

    if (result.isConfirmed) {
      try {
        await toggleFavoriteTask(id);
        fetchTasks();
        Swal.fire(
          "Sucesso",
          `Tarefa ${task.is_favorite ? "removida das" : "adicionada às"} favoritas.`,
          "success"
        );
      } catch (error) {
        Swal.fire("Erro", "Ocorreu um erro ao tentar favoritar a tarefa.", "error");
      } finally {
        setUpdatingTaskId(null);
      }
    } else {
      setUpdatingTaskId(null);
    }
  };

  const favoriteTasks = tasks.filter(task => task.is_favorite);
  const otherTasks = tasks.filter(task => !task.is_favorite);

  return (
    <div className={styles.Tasks}>
      <Header 
        searchValue={search} 
        onSearchChange={handleSearchChange} 
        onSearchSubmit={handleSearchSubmit} 
      />
      <main className={styles.main}>
        <AddTaskForm onSubmit={handleNoteSubmit} submitting={submitting} />

        {loading ? (
          <div className={styles.spinnerContainer}>
            <FaSpinner className={styles.spinner} />
          </div>
        ) : (
          <>
            <div className={styles.section}>
              <h3>Favoritas</h3>
              <div className={styles.cardsContainer}>
                {favoriteTasks.map((task) => (
                  <Card
                    key={task.id}
                    id={task.id}
                    title={task.title}
                    description={task.description}
                    color={task.color}
                    isFavorite={task.is_favorite}
                    onEdit={() => handleEditTask(task)}
                    onDelete={() => handleDeleteTask(task.id)}
                    onChangeColor={(newColor) => changeTaskColorHandler(task.id, newColor)}
                    onFavoriteToggle={() => toggleFavorite(task.id)}
                    isUpdating={updatingTaskId === task.id}
                  />
                ))}
              </div>
            </div>

            <div className={styles.section}>
              <h3>Outras</h3>
              <div className={styles.cardsContainer}>
                {otherTasks.map((task) => (
                  <Card
                    key={task.id}
                    id={task.id}
                    title={task.title}
                    description={task.description}
                    color={task.color}
                    isFavorite={task.is_favorite}
                    onEdit={() => handleEditTask(task)}
                    onDelete={() => handleDeleteTask(task.id)}
                    onChangeColor={(newColor) => changeTaskColorHandler(task.id, newColor)}
                    onFavoriteToggle={() => toggleFavorite(task.id)}
                    isUpdating={updatingTaskId === task.id}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        <TaskModal
          task={taskToEdit}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveTask}
        />
      </main>
    </div>
  );
};

export default TaskPage;

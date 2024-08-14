import { ITask } from "../types/Task";
import axios from 'axios';

const API = "http://localhost:8080/api";

const endpoint = (path: string): string => API + path;

export const getTasks = async (): Promise<ITask[]> => {
  return fetch(endpoint("/tasks"))
    .then(response => response.json());
};

export const searchTasks = async (query: string): Promise<ITask[]> => {
  return fetch(endpoint(`/tasks/search?query=${encodeURIComponent(query)}`))
    .then(response => response.json());
};

export const editTask = async (id: number, data: Partial<ITask>): Promise<void> => {
  return fetch(endpoint(`/tasks/${id}`), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }).then(() => {});
};

export const deleteTask = async (id: number): Promise<void> => {
  return fetch(endpoint(`/tasks/${id}`), {
    method: 'DELETE'
  }).then(() => {});
};

export const changeTaskColor = async (id: number, color: string): Promise<void> => {
  return fetch(endpoint(`/tasks/${id}/color`), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ color })
  }).then(() => {});
};

export const toggleFavoriteTask = async (id: number): Promise<void> => {
  return fetch(endpoint(`/tasks/${id}/favorite`), {
    method: 'PUT',
  }).then(() => {});
};

// Função para criar uma nova tarefa
export const createTask = async (data: { title: string; description: string; is_favorite: boolean; color: string; }): Promise<void> => {
  return fetch(endpoint(`/tasks`), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }).then(() => {});
};

export const updateTask = async (id: number, data: Partial<ITask>): Promise<void> => {
  return fetch(endpoint(`/tasks/${id}`), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }).then(() => {});
};


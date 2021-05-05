import { useEffect, useState } from 'react';

import '../styles/tasklist.scss'

import { FiTrash, FiCheckSquare } from 'react-icons/fi';

interface Task {
  id: number;
  title: string;
  isComplete: boolean;
}

export function TaskList() {
  const seconds = 3;
  const [error, setError] = useState('');
  const [errorTimer, setErrorTimer] = useState(0);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  useEffect(() => {
    setTimeout(() => {
      if (errorTimer > 0) setErrorTimer(errorTimer - (seconds * 60 / 100));
      else setError('')
    }, 60);
  }, [errorTimer]);

  function throwError(erro: string) {
    setError(erro);
    setErrorTimer(100);
  }

  function handleCreateNewTask() {
    setError('');
    // Crie uma nova task com um id random, não permita criar caso o título seja vazio.
    if (newTaskTitle == '') return throwError('Nenhum título informado');
    const taskAlreadyExists = tasks.find(task => task.title == newTaskTitle)
    if (taskAlreadyExists) return throwError('Esta tarefa já foi adicionada');
    const id = Math.floor(Math.random() * 10000);
    const task = [{ id, title: newTaskTitle, isComplete: false }]
    setTasks(oldValue => [...oldValue, ...task]);
  }

  function handleToggleTaskCompletion(id: number) {
    setTasks((oldValue) => oldValue.map((task) => {
      if (task.id == id) {
        task.isComplete = !task.isComplete;
        return task
      } else {
        return task
      }
    }))
  }

  function handleRemoveTask(id: number) {
    const _task = tasks.filter(task => task.id !== id);
    setTasks(_task)
  }

  return (
    <section className="task-list container">
      {!!error &&
        <div>
          <div className="error">
            <span>
              {error}
            </span>
            <div className="errorTimer" style={{ width: errorTimer + '%' }}></div>
          </div>
        </div>
      }
      <header>
        <h2>Minhas tasks</h2>

        <div className="input-group">
          <input
            type="text"
            placeholder="Adicionar novo todo"
            onChange={(e) => setNewTaskTitle(e.target.value)}
            value={newTaskTitle}
          />
          <button type="submit" data-testid="add-task-button" onClick={handleCreateNewTask}>
            <FiCheckSquare size={16} color="#fff" />
          </button>
        </div>
      </header>

      <main>
        <ul>
          {tasks.map(task => (
            <li key={task.id}>
              <div className={task.isComplete ? 'completed' : ''} data-testid="task" >
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    readOnly
                    checked={task.isComplete}
                    onClick={() => handleToggleTaskCompletion(task.id)}
                  />
                  <span className="checkmark"></span>
                </label>
                <p>{task.title}</p>
              </div>

              <button type="button" data-testid="remove-task-button" onClick={() => handleRemoveTask(task.id)}>
                <FiTrash size={16} />
              </button>
            </li>
          ))}

        </ul>
      </main>
    </section >
  )
}
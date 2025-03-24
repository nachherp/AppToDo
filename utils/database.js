import * as SQLite from 'expo-sqlite';

let db;

const initializeDatabase = async () => {
  try {
    db = await SQLite.openDatabaseAsync('tasks.db');
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        name TEXT NOT NULL
      );
    `);
    console.log('Base de datos lista');
  } catch (error) {
    console.error('Error al configurar la bd:', error);
  }
};

const insertTask = async (taskName) => {
  try {
    if (!taskName.trim()) throw new Error('Ingresa un texto válido para la tarea.');
    const result = await db.runAsync('INSERT INTO tasks (name) VALUES (?);', [taskName]);
    console.log(`Tarea insertada correctamente. ID asignado: ${result.lastInsertRowId}`);
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Error durante la insercion de la tarea:', error);
  }
};

const modifyTask = async (id, newName) => {
  try {
    const result = await db.runAsync('UPDATE tasks SET name = ? WHERE id = ?;', [newName, id]);
    console.log(`Tarea actualizada. numero de registros modificados: ${result.changes}`);
  } catch (error) {
    console.error('Error al modificar la tarea:', error);
  }
};

const removeTask = async (id) => {
  try {
    const result = await db.runAsync('DELETE FROM tasks WHERE id = ?;', [id]);
    console.log(`Tarea eliminada correctamente. Registros afectados: ${result.changes}`);
  } catch (error) {
    console.error('Error al eliminar la tarea:', error);
  }
};

const getTasks = async () => {
  try {
    const tasks = await db.getAllAsync('SELECT * FROM tasks;');
    console.log('Tareas recuperadas del sistema:', tasks);
    return tasks;
  } catch (error) {
    console.error('Error al recuperar las tareas:', error);
    return [];
  }
};

module.exports = {
  initDB: initializeDatabase,
  fetchAllTasks: getTasks,
  addTask: insertTask,
  updateTask: modifyTask,
  deleteTask: removeTask,
};

import { DocumentData, DocumentReference, deleteDoc, collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { db } from "./firebaseConfig";

export const addTask = async (taskObj) => {
  try {
    const ref = doc(collection(db, 'tasks'));
    const taskId = ref.id;
    const taskWithId = { ...taskObj, taskId };

    await setDoc(ref, taskWithId);
    console.log('Task data saved successfully with ID:', taskId);
  } catch (error) {
    console.error('Error saving task data:', error);
    throw error;
  }
};

export const updateTask = async (task) => {
  try {
    const taskRef = doc(db, 'tasks', task.id);
    await setDoc(taskRef, task);
    console.log('Task updated successfully.');
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

export const deleteTask = async (taskId) => {
  try {
    const taskRef = doc(db, 'tasks', taskId);
    await deleteDoc(taskRef);
    console.log('Task deleted successfully with ID:', taskId);
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

export const findTasksByEmail = async (userEmail) => {
  const tasksRef = collection(db, 'tasks');

  // Query for tasks where userEmail is in assignedTo
  const assignedToQuery = query(tasksRef, where('assignedTo', 'array-contains', userEmail));
  const assignedToSnapshot = await getDocs(assignedToQuery);
  const assignedToTasks = assignedToSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  // Query for tasks where userEmail is in createdBy
  const createdByQuery = query(tasksRef, where('createdBy', '==', userEmail));
  const createdBySnapshot = await getDocs(createdByQuery);
  const createdByTasks = createdBySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  // Merge the two sets of tasks
  const allTasks = [...assignedToTasks, ...createdByTasks];

  // Remove duplicates (if any)
  const uniqueTasks = Array.from(new Set(allTasks.map(task => task.id)))
    .map(id => allTasks.find(task => task.id === id));

  return uniqueTasks;
};



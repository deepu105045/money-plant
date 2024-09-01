import {  deleteDoc, collection, doc, getDocs, query, setDoc, where, CollectionReference, DocumentData, addDoc } 
      from "firebase/firestore";
import { db } from "./firebaseConfig";
import { Task } from "../interfaces/TaskInterface";

export const addTask = async (familyId: string, taskObj: Task) => {
  try {
    const ref = collection(db, `tasks/${familyId}/allTasks`);
    const docRef = await addDoc(ref, taskObj);
    console.log('Task data saved successfully with ID:', docRef.id);
  } catch (error) {
    console.error('Error saving task data:', error);
    throw error;
  }
};

export const updateTask = async (familyId: string, task: Task) => {
  try {
    if (!task.taskId) {
      throw new Error('Task ID is required to update a task');
    }
    const taskRef = doc(db, `tasks/${familyId}/allTasks`, task.taskId);
    await setDoc(taskRef, task, { merge: true });
    console.log('Task updated successfully.');
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

export const deleteTask = async (familyId: string, taskId: string) => {
  try {
    const taskRef = doc(db, `tasks/${familyId}/allTasks`, taskId);
    await deleteDoc(taskRef);
    console.log('Task deleted successfully with ID:', taskId);
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

export const getTasksByFamilyId = async (familyId: string) => {
  try {
    const tasksRef = collection(db, `tasks/${familyId}/allTasks`);
    const tasksQuery = query(tasksRef);
    const querySnapshot = await getDocs(tasksQuery);

    const tasks = querySnapshot.docs.map(doc => ({
      ...doc.data(),
      taskId: doc.id
    }));

    return tasks;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};


export const findTasksByEmail = async (userEmail: string): Promise<Task[]> => {
  const tasksRef = collection(db, 'tasks');
  

  // Query for tasks where userEmail is in assignedTo
  const assignedToQuery = query(tasksRef, where('assignedTo', 'array-contains', userEmail));
  const assignedToSnapshot = await getDocs(assignedToQuery);
  const assignedToTasks = assignedToSnapshot.docs.map(doc => ({
    taskId: doc.id,
    ...(doc.data() as Task)
  }));

  // Query for tasks where userEmail is in createdBy
  const createdByQuery = query(tasksRef, where('createdBy', '==', userEmail));
  const createdBySnapshot = await getDocs(createdByQuery);
  const createdByTasks = createdBySnapshot.docs.map(doc => ({
    taskId: doc.id,
    ...(doc.data() as Task)
  }));

  // Use a Map to ensure unique taskId and combine tasks
  const taskMap = new Map<string, Task>();

  assignedToTasks.forEach(task => taskMap.set(task.taskId, task));
  createdByTasks.forEach(task => taskMap.set(task.taskId, task));

  // Convert the Map values to an array
  const uniqueTasks: Task[] = Array.from(taskMap.values());

  return uniqueTasks;
};




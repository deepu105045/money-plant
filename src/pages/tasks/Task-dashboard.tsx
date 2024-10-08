import React, { useState, useEffect } from 'react';
import { IonPage, IonContent, IonFab, IonFabButton, IonIcon, IonToast } from '@ionic/react';
import { add } from 'ionicons/icons';
import TaskList from './TaskList';
import TaskForm from './TaskForm';
import { AppBar, Toolbar, IconButton, Typography, Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useHistory, useParams } from 'react-router-dom';
import { addTask, updateTask, deleteTask, getTasksByFamilyId } from '../../components/firebase/tasksService'; // Import getTasksByFamilyId
import { useSelector } from 'react-redux';
import { selectUserInfo } from '../../state/userSlice';
import { findFamilyMembersByEmail } from '../../components/firebase/homeData';
import { Task } from '../../components/interfaces/TaskInterface';

const TaskDashboard: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [toastMessage, setToastMessage] = useState<string>('');
    const history = useHistory();
    const userInfo = useSelector(selectUserInfo);
    const [currentUser, setCurrentUser] = useState<string | null>(null);
    const [members, setMembers] = useState<string[]>([]);
    const [reloadTasks, setReloadTasks] = useState(false);
    const { id: familyId } = useParams<{ id: string }>();

    useEffect(() => {
        if (userInfo) {
            setCurrentUser(userInfo.email);
        }
    }, [userInfo]);

    useEffect(() => {
        const fetchTasksAndMembers = async () => {
            if (!currentUser) return;

            try {
                const familyTasks = await getTasksByFamilyId(familyId); // Fetch tasks by familyId
                setTasks(familyTasks);
                const mem = await findFamilyMembersByEmail(currentUser);
                setMembers(mem);
            } catch (error) {
                console.error('Error fetching tasks or family members:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTasksAndMembers();
    }, [currentUser, familyId, reloadTasks]); // Ensure familyId is included in the dependency array

    const handleSaveTask = (taskName: string, dueDate: string, assignedTo: string[]) => {
        if (!currentUser) return;

        const newTask = {
            taskName,
            dueDate,
            assignedTo,
            isCompleted: false,
            createdBy: currentUser,
            status: 'Start'
        };

        addTask(familyId, newTask);
        setReloadTasks(prev => !prev);
        setShowForm(false);
    };

    const handleBack = () => {
        history.goBack();
    };

    const handleCompleteTask = async (task: Task) => {
        task.status = 'Done';
        await updateTask(familyId, task);
        setReloadTasks(prev => !prev);
    };

    const handleDeleteTask = async (task: Task) => {
        try {
            if (task.taskId) {
                await deleteTask(familyId, task.taskId);
                setTasks(tasks.filter(t => t.taskId !== task.taskId));
                setCompletedTasks(completedTasks.filter(t => t.taskId !== task.taskId));
                setToastMessage(`Task "${task.taskName}" deleted successfully.`);
                setReloadTasks(prev => !prev);
            }
        } catch (error) {
            setToastMessage(`Error deleting task "${task.taskName}".`);
        }
    };

    return (
        <IonPage>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={handleBack} aria-label="back">
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6" component="div">
                        Tasks
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                </Toolbar>
            </AppBar>
            <IonContent>
                <TaskList
                    tasks={tasks}
                    currentUser={currentUser || ''}
                    updateStatus={handleCompleteTask}
                    loading={loading}
                    deleteTask={handleDeleteTask}
                />

                <IonFab vertical="bottom" horizontal="center" slot="fixed">
                    <IonFabButton onClick={() => setShowForm(true)}>
                        <IonIcon icon={add} />
                    </IonFabButton>
                </IonFab>
                {showForm && <TaskForm users={members} currentUser={currentUser || ''} onSave={handleSaveTask} />}

                <IonToast
                    isOpen={!!toastMessage}
                    message={toastMessage}
                    duration={3000}
                    onDidDismiss={() => setToastMessage('')}
                />
            </IonContent>
        </IonPage>
    );
};

export default TaskDashboard;

import React from 'react';
import { IonButton, IonText, IonSpinner, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonList, IonItem, IonLabel, IonIcon } from '@ionic/react';
import { trashBinOutline } from 'ionicons/icons';

interface Task {
  taskName: string;
  dueDate: string;
  isCompleted: boolean;
  createdBy: string;
  status: string;
}

interface TaskListProps {
  tasks: Task[];
  updateStatus: (task: Task) => void;
  deleteTask;
  loading: boolean;
  currentUser: string;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, currentUser, updateStatus, loading,deleteTask }) => {
  const [showAlert, setShowAlert] = React.useState(false);

  React.useEffect(() => {
    if (!loading && tasks.length === 0) {
      setShowAlert(true);
    }
  }, [loading, tasks.length]);

  const inProgressTasks = tasks.filter(task => task.status !== 'Done');
  const completedTasks = tasks.filter(task => task.status === 'Done');

  console.log('Completed tasks ' + completedTasks)
  console.log('inProgress Tasks  ' + inProgressTasks)
  return (
    <>
      {loading ? (
        <IonSpinner name="crescent" />
      ) : (
        <>
          {inProgressTasks.length === 0 ? (
            <IonText color="medium">
              <p style={{ textAlign: 'center', marginTop: '20px' }}>No Tasks Available!</p>
            </IonText>
          ) : (
            <>
              {inProgressTasks.map((task, index) => (
                <IonCard
                  key={index}
                  style={{
                    backgroundColor: index % 2 === 0 ? '#f0f0f0' : '#ffffff', // Change colors as needed
                  }}
                >
                  <IonCardHeader>
                    <IonCardTitle>{task.taskName}</IonCardTitle>
                    <IonCardSubtitle>Due by: {task.dueDate}</IonCardSubtitle>
                    <IonCardSubtitle>Created by: {task.createdBy}</IonCardSubtitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <IonButton color="primary" onClick={() => updateStatus(task)}>Mark as Done</IonButton>

                  </IonCardContent>
                </IonCard>
              ))}
            </>
          )}

          {completedTasks.length > 0 && (
            <IonList>
              <IonText color="medium">
                <p style={{ textAlign: 'center', marginTop: '20px' }}>Completed Tasks</p>
              </IonText>
              {completedTasks.map((task, index) => (
                <IonItem key={index}>
                  <IonLabel>
                    <h2>{task.taskName}</h2>
                  </IonLabel>
                  <IonIcon icon={trashBinOutline} onClick={() =>deleteTask(task)}/>
                  </IonItem>
              ))}
            </IonList>
          )}
        </>
      )}
    </>
  );
};

export default TaskList;

import React from 'react';
import { IonButton, IonText, IonSpinner, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonList, IonItem, IonLabel, IonIcon, IonListHeader, IonAccordion } from '@ionic/react';
import { trashBinOutline } from 'ionicons/icons';
import { Task } from '../../components/interfaces/TaskInterface'
import Divider from '@mui/material/Divider';



interface TaskListProps {
  tasks: Task[];
  updateStatus: (task: Task) => void;
  deleteTask: (task: Task) => void;
  loading: boolean;
  currentUser: string;

}

const TaskList: React.FC<TaskListProps> = ({ tasks, currentUser, updateStatus, loading, deleteTask }) => {

  const inProgressTasks = tasks.filter(task => task.status !== 'Done');
  const completedTasks = tasks.filter(task => task.status === 'Done');

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
            inProgressTasks.map((task, index) => (
              <>
              <IonCard
                key={index}
                
              >
                <IonCardHeader>
                  <IonCardTitle>{task.taskName}</IonCardTitle>
                  <IonCardSubtitle>Due by: {task.dueDate}</IonCardSubtitle>
                  <IonCardSubtitle>Created by: {task.createdBy}</IonCardSubtitle>
                  
                </IonCardHeader>
                <IonCardContent style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>{/* Add other content if needed */}</div>
                  <IonButton color="primary" onClick={() => updateStatus(task)}>Mark as Done</IonButton>
                </IonCardContent>
              </IonCard>
              
              </>
            ))
          )}

          <Divider component="li" />


          {completedTasks.length > 0 && (
            <IonList>

              <IonListHeader>
                <IonText >
                  <h1>Completed Task</h1>
                </IonText>
              </IonListHeader>
              {completedTasks.map((task, index) => (
                <IonItem key={index}>
                  <IonLabel>
                    <h2>{task.taskName}</h2>
                  </IonLabel>
                  <IonIcon icon={trashBinOutline} onClick={() => deleteTask(task)} />
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

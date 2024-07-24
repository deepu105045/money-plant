import React, { useState } from 'react';
import { IonContent, IonPage } from '@ionic/react';
import { Container, Box, Grid, TextField, FormControl, FormControlLabel, FormGroup, FormLabel, Checkbox, Button } from '@mui/material';
import { useHistory } from 'react-router-dom';

interface TaskProps {
  users: string[];
  currentUser: string;
  onSave: (task: string, date: string, assignedTo: string[]) => void;
}

const TaskForm: React.FC<TaskProps> = ({ users, currentUser, onSave }) => {
  const [task, setTask] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [assignedTo, setAssignedTo] = useState<string[]>([]);
  const history = useHistory();

  const handleSave = () => {
    onSave(task, date, assignedTo);
    setTask('');
    setDate('');
    setAssignedTo([]);
  };

  const handleBack = () => {
    history.goBack();
  };

  const handleAssignedToChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setAssignedTo(prevState =>
      event.target.checked
        ? [...prevState, value]
        : prevState.filter(item => item !== value)
    );
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <Container disableGutters maxWidth="sm">
          <Box mt={3} p={2} boxShadow={3} borderRadius={2} bgcolor="background.paper">
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Task"
                multiline
                rows={2}
                value={task}
                onChange={(e) => setTask(e.target.value)}
              />
            </Grid>

            <Box mt={2} />

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Due Date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>

            <Box mt={2} />

            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Assign to :</FormLabel>
                <FormGroup>
                  {users.map(option => (
                    <FormControlLabel
                      key={option}
                      control={
                        <Checkbox
                          checked={assignedTo.includes(option)}
                          onChange={handleAssignedToChange}
                          value={option}
                        />
                      }
                      label={option}
                    />
                  ))}
                </FormGroup>
              </FormControl>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Button onClick={handleSave} fullWidth variant="contained">Assign</Button>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </IonContent>
    </IonPage>
  );
};

export default TaskForm;

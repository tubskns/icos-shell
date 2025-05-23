import React from "react";
import Card from "@mui/material/Card";
import { Typography } from "@mui/material";
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Switch from '@mui/material/Switch';

export default function SwitchesWithFormGroup() {

  const [state, setState] = React.useState({
    gilad: true,
    jason: false,
    antoine: true,
  });

  const handleChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    });
  };

  return (
    <>
      <Card
        sx={{
          boxShadow: "none",
          borderRadius: "10px",
          p: "25px",
          mb: "15px",
        }}
      >
        <Typography
          as="h3"
          sx={{
            fontSize: 18,
            fontWeight: 500,
            mb: '10px'
          }}
        >
          Switches With Form Group
        </Typography>

        <FormControl component="fieldset" variant="standard">
          <FormLabel component="legend">Assign responsibility</FormLabel>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch checked={state.gilad} onChange={handleChange} name="gilad" />
              }
              label="Gilad Gray"
            />
            <FormControlLabel
              control={
                <Switch checked={state.jason} onChange={handleChange} name="jason" />
              }
              label="Jason Killian"
            />
            <FormControlLabel
              control={
                <Switch checked={state.antoine} onChange={handleChange} name="antoine" />
              }
              label="Antoine Llorca"
            />
          </FormGroup>
          <FormHelperText>Be careful</FormHelperText>
        </FormControl>
      </Card>
    </>
  );
}

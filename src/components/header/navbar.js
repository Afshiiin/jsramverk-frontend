import React from "react";
import { makeStyles } from '@mui/styles';
import { Paper } from '@mui/material';
import { Tabs } from '@mui/material';
import { Tab } from '@mui/material';



const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    backgroundColor: "#F2F2F2",
  },
});

export default function Navbar() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Paper className={classes.root}>
      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
        centered
      >
        <Tab label="Text Editor" />
        {/* <Tab label="" />
        <Tab label="" /> */}
      </Tabs>
    </Paper>
  );
}

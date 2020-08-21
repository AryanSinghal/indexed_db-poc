import React from 'react';
import {
  Paper, Button, Grid, TextField, MenuItem,
} from '@material-ui/core';
import faker from 'faker';
import MaterialTable from 'material-table';

const Todo = () => {
  const [dataStructure, setDataStructure] = React.useState('array');
  const [array, setArray] = React.useState([]);
  const [dataCount, setDataCount] = React.useState(1);
  const [error, setError] = React.useState('');

  const generateData = () => {
    if (dataStructure === 'array') {
      for (let i = 0; i < dataCount; i += 1) {
        array.push({
          jobTitle: faker.name.jobTitle(),
          jobType: faker.name.jobType(),
        });
      }
      setArray([...array]);
    }
  };

  const deleteData = () => {
    if (dataStructure === 'array') {
      for (let i = 0; i < dataCount; i += 1) {
        array.pop();
      }
      setArray([...array]);
    }
  };

  const handleScrollDownChange = (event) => {
    if (event.target.value !== 'array') {
      setArray([]);
    }
    setDataStructure(event.target.value);
  };

  const handleCountChange = (event) => {
    const count = event.target.value;
    setDataCount(count);
    if (!(Number(count) > 0)) {
      setError('Enter valid no. of data items');
    } else {
      setError('');
    }
  };

  const options = [
    {
      value: 'array',
      label: 'Array',
    },
    {
      value: 'db',
      label: 'IndexedDB',
    },
  ];
  const columns = [
    { title: 'Job Title', field: 'jobTitle' },
    { title: 'Job Type', field: 'jobType' },
  ];

  return (
    <div align="center">
      <br />
      <Grid container spacing={2}>
        <Grid item xs={2}>
          <TextField
            id="data-structure"
            select
            label="Select Data Structure"
            value={dataStructure}
            onChange={handleScrollDownChange}
            helperText="Please select your currency"
            variant="outlined"
          >
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={4}>
          <TextField
            required
            fullWidth
            size="small"
            id="count"
            label="No of data items"
            variant="outlined"
            helperText={error}
            error={!!(error)}
            onChange={handleCountChange}
            onBlur={handleCountChange}
          />
        </Grid>
        <Grid item xs={3}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            onClick={generateData}
          //   disabled={this.isDisabled()}
          >
            Add Todo
          </Button>
        </Grid>
        <Grid item xs={3}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            onClick={deleteData}
          >
            Delete Todo
          </Button>
        </Grid>
      </Grid>
      <div align="center">
        {console.log(array)}
        {
          (array && array.length)
            ? (
              <MaterialTable
                title="TODO"
                columns={columns}
                data={array}
              />
            )
            : null
        }
      </div>
    </div>
  );
};

export default Todo;

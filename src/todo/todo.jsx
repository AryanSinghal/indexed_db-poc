import React, { useEffect } from 'react';
import {
  Button, Grid, TextField, MenuItem,
} from '@material-ui/core';
import faker from 'faker';
import MaterialTable from 'material-table';
import Dexie from 'dexie';
import { forwardRef } from 'react';
import {
  ChevronLeft, ArrowDownward, Clear, ChevronRight, FirstPage, LastPage, Search,
} from '@material-ui/icons';

const Todo = () => {
  const [dataStructure, setDataStructure] = React.useState('array');
  const [array, setArray] = React.useState([]);
  const [arrayFromDB, setArrayFromDB] = React.useState([]);
  const [dataCount, setDataCount] = React.useState(1);
  const [error, setError] = React.useState('');
  const [store, setStore] = React.useState();
  const [addDelete, setAddDelete] = React.useState(false);

  useEffect(() => {
    try {
      if (!('indexedDB' in window)) {
        console.log('This browser doesn\'t support IndexedDB');
        return;
      }
      const db = new Dexie('listOfObjects');
      db.version(1).stores({
        listOfObjects: 'id,jobTitle,jobType',
      });
      db.listOfObjects.clear();
      setStore(db.listOfObjects);
    } catch (err) {
      console.log(err);
    }
  }, []);

  const generateData = async () => {
    const initialTime = new Date();
    if (dataStructure === 'array') {
      for (let i = 0; i < dataCount; i += 1) {
        array.push({
          jobTitle: faker.name.jobTitle(),
          jobType: faker.name.jobType(),
        });
      }
      setAddDelete(false);
      console.log('time taken by Array in inserting is:', (new Date() - initialTime));
      return setArray([...array]);
    }
    try {
      const arrayFromDBLength = arrayFromDB.length;
      for (let i = 1; i <= dataCount; i += 1) {
        store.add({
          id: arrayFromDBLength + i,
          jobTitle: faker.name.jobTitle(),
          jobType: faker.name.jobType(),
        });
      }
      console.log('time taken by DB in inserting is:', (new Date() - initialTime));
      const dbArray = await store.where('id').above(0).toArray();
      console.log('time taken by DB in inserting and retrieval is:', (new Date() - initialTime));
      setAddDelete(false);
      return setArrayFromDB(dbArray);
    } catch (e) {
      setAddDelete(false);
      return alert(`Error:  + ${e.stack || e}`);
    }
  };

  const deleteData = async () => {
    const initialTime = new Date();
    if (dataStructure === 'array') {
      const arrayLength = array.length;
      for (let i = 0; i < dataCount && arrayLength; i += 1) {
        array.pop();
      }
      console.log('time taken by Array in deleting is:', (new Date() - initialTime));
      setAddDelete(false);
      return setArray([...array]);
    }
    try {
      const arrayLength = arrayFromDB.length;
      for (let i = 0; i < dataCount && arrayLength; i += 1) {
        store.delete(arrayLength - i);
      }
      console.log('time taken by DB in deleting is:', (new Date() - initialTime));
      const dbArray = await store.where('id').above(0).toArray();
      console.log('time taken by DB in deleting and retrieval is:', (new Date() - initialTime));
      setAddDelete(false);
      return setArrayFromDB(dbArray);
    } catch (e) {
      setAddDelete(false);
      return alert(`Error:  + ${e.stack || e}`);
    }
  };

  const disableButton = () => {
    setAddDelete(true);
  };

  const handleScrollDownChange = (event) => {
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

  const tableIcons = {
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  };
  
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
            onClick={() => {
              disableButton();
              generateData();
            }}
            disabled={addDelete}
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
            onClick={() => {
              disableButton();
              deleteData();
            }}
            disabled={addDelete}
          >
            Delete Todo
          </Button>
        </Grid>
      </Grid>
      <MaterialTable
        title="TODO"
        icons={tableIcons}
        columns={columns}
        data={(dataStructure === 'array') ? [...array] : [...arrayFromDB]}
      />
    </div>
  );
};

export default Todo;

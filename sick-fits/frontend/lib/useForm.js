import { useState } from 'react';

export default function useForm(initial = {}) {
  // create a state object for our form inputs
  const [inputs, setInputs] = useState(initial);
  // create a function that updates the state object
  const handleChange = (e) => {
    let { value, name, type } = e.target;

    // check to see if the input is a number, and if it is, convert it to a number
    if (type === 'number') {
      value = parseInt(value);
    }

    // check to see if the input is a file and handle it accordingly if so
    if (type === 'file') {
      [value] = e.target.files;
    }

    // console.log('[handleChange]', { value, name, type });
    setInputs({
      // copy the existing state first
      ...inputs,
      // update the state with the new input value
      [name]: value,
    });
  };

  function resetForm() {
    setInputs(initial);
  }

  function clearForm() {
    // setInputs({}); // doesn't work
    const blankState = Object.fromEntries(
      Object.entries(inputs).map(([key, value]) => [key, ''])
    );
    setInputs(blankState);
  }

  // return the things we wan to surface from this custom hook
  // specifically, an object that includes the state and a function to update it
  return { inputs, handleChange, resetForm, clearForm };
}

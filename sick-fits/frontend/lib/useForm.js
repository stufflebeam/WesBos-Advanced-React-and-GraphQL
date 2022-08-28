import { useEffect, useState } from 'react';

export default function useForm(initial = {}) {
  // create a state object for our form inputs
  const [inputs, setInputs] = useState(initial);
  // const initialValues = Object.values(initial).join('');
  // This 'feels' better than the suggested solution (above), as it avoids useEffect()
  // being called due to object property order not being guaranteed.
  // This way, it only gets called when the form is first populated with fetched data
  // and the values go from '' to something else.
  const initialValuesEmpty = Object.values(initial).join('') === '';
  // console.log('[useForm] initialValuesEmpty: ', initialValuesEmpty);

  useEffect(() => {
    // This function runs when the things we are watching change
    // console.log(
    //   '[useForm] useEffect() initialValuesEmpty: ',
    //   initialValuesEmpty
    // );
    setInputs(initial);
  }, [initialValuesEmpty]);

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

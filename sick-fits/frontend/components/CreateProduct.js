import useForm from '../lib/useForm';
import Form from './styles/Form';

export default function CreateProduct() {
  //   const placeholder =
  //     'https://res.cloudinary.com/stufflebeam/image/upload/v1661582104/placeholder/placeholder-images-product-2_large.webp';

  const { inputs, handleChange, resetForm, clearForm } = useForm({
    name: 'Test Product',
    description: 'This is a test product',
    price: 929,
    image: '',
  });

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        console.log(inputs);
        resetForm();
      }}
    >
      <fieldset>
        <label htmlFor="image">
          Image:
          {/* TODO: Fix the reset of this form element on submit -- it currently retains the submitted value */}
          <input required type="file" name="image" onChange={handleChange} />
        </label>
        <label htmlFor="name">
          Name:
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={inputs.name}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="description">
          Description:
          <textarea
            id="description"
            name="description"
            placeholder="Description"
            value={inputs.description}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="price">
          Price:
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={inputs.price}
            onChange={handleChange}
          />
        </label>
        <button type="submit">+ Add Product</button>
      </fieldset>
    </Form>
  );
}

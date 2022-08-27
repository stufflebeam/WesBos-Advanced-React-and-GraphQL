import useForm from '../lib/useForm';

export default function CreateProduct() {
  const placeholder =
    'https://res.cloudinary.com/stufflebeam/image/upload/v1661582104/placeholder/placeholder-images-product-2_large.webp';

  const { inputs, handleChange, resetForm, clearForm } = useForm({
    name: 'Test Product',
    description: 'This is a test product',
    price: 929,
    image: placeholder,
  });

  return (
    <form>
      <label>
        Name:
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={inputs.name}
          onChange={handleChange}
        />
      </label>
      <label>
        Description:
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={inputs.description}
          onChange={handleChange}
        />
      </label>
      <label>
        Price:
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={inputs.price}
          onChange={handleChange}
        />
      </label>
      <img src={inputs.image} alt={inputs.name} />
      <button type="button" onClick={clearForm}>
        clear
      </button>
      <button type="button" onClick={resetForm}>
        reset
      </button>
    </form>
  );
}

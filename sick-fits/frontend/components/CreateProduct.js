import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import Router from 'next/router';
import useForm from '../lib/useForm';
import Form from './styles/Form';
import DisplayError from './ErrorMessage';
import { ALL_PRODUCTS_QUERY } from './Products';

const CREATE_PRODUCT_MUTATION = gql`
  mutation CREATE_PRODUCT_MUTATION(
    # which variables we want to pass to the mutation
    $name: String!
    $description: String!
    $price: Int!
    $image: Upload
  ) {
    createProduct(
      data: {
        name: $name
        description: $description
        price: $price
        photo: { create: { image: $image, altText: $name } }
        status: "AVAILABLE"
      }
    ) {
      id
      name
      price
      description
    }
  }
`;

export default function CreateProduct() {
  //   const placeholder =
  //     'https://res.cloudinary.com/stufflebeam/image/upload/v1661582104/placeholder/placeholder-images-product-2_large.webp';

  const { inputs, handleChange, resetForm, clearForm } = useForm({
    name: '',
    description: '',
    price: 0,
    image: '',
  });

  const [createProduct, { loading, error, data }] = useMutation(
    CREATE_PRODUCT_MUTATION,
    {
      variables: inputs,
      // tell Apollo to update the cache after the mutation is complete
      // so that the new product is available immediately when the user
      // goes to the Products page.
      refetchQueries: [{ query: ALL_PRODUCTS_QUERY }],
    }
  );

  return (
    <Form
      onSubmit={async (e) => {
        e.preventDefault();
        // console.log(inputs);
        try {
          // submit the inputs to the backend
          const res = await createProduct();
          // console.log('res: ', res);
          clearForm();
          // go to the products page
          Router.push({
            // could also use the data object we destrctured from the
            // useMutation hook above to get the id of the new product
            pathname: `/product/${res.data.createProduct.id}`,
            // TODO: Consider creating a custom slug for each product
            //       when it is added to the database, and then using
            //       that slug instead of the product id in the link
            //       to the product page. (Next.js supports this)
          });
        } catch (error) {
          console.error('[CreateProduct] submission error: ', error);
        }
      }}
    >
      <DisplayError error={error} />
      <fieldset disabled={loading} aria-busy={loading}>
        <label htmlFor="image">
          Image:
          {/* TODO: Fix the reset of this form element on submit -- it currently retains the submitted value */}
          {/*       Refer to this post for an idea of how to handle this: */}
          {/*       https://thewebdev.info/2021/05/29/how-to-reset-a-file-inputs-value-in-react/ */}
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

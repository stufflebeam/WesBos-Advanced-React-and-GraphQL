import gql from 'graphql-tag';
import Head from 'next/head';
import { useQuery, useMutation } from '@apollo/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { SINGLE_ITEM_QUERY } from './SingleProduct';
import useForm from '../lib/useForm';
import Form from './styles/Form';
import DisplayError from './ErrorMessage';
import LoadingAnimation from './LoadingAnimation';

const UPDATE_PRODUCT_MUTATION = gql`
  mutation UPDATE_PRODUCT_MUTATION(
    # which variables we want to pass to the mutation
    $id: ID!
    $name: String
    $description: String
    $price: Int # $image: Upload # $status: String
  ) {
    updateProduct(
      id: $id
      data: {
        name: $name
        description: $description
        price: $price
        # photo: { create: { image: $image, altText: $name } }
        # status: $status
      }
    ) {
      id
      name
      price
      description
      photo {
        image {
          publicUrlTransformed
        }
      }
      status
    }
  }
`;

export default function UpdateProduct({ id }) {
  // Query product data for initial form values and post-update
  const { loading, error, data } = useQuery(SINGLE_ITEM_QUERY, {
    variables: { id },
  });
  //   console.log('[UpdateProduct] 1: ', { data, loading, error });

  const { name, price, description, photo } = data?.Product || {};
  const { inputs, handleChange, resetForm, clearForm } = useForm({
    name,
    description,
    price,
    // image: photo,
  });

  //   console.log('[UpdateProduct] 2: ', { name, price, description, inputs });
  // Update product mutation and refetch query
  const [
    updateProduct,
    { data: updateData, error: updateError, loading: updateLoading },
  ] = useMutation(UPDATE_PRODUCT_MUTATION, {
    variables: {
      id,
      name: inputs.name,
      description: inputs.description,
      price: inputs.price,
      // image: inputs.image,
    },
    refetchQueries: [{ query: SINGLE_ITEM_QUERY, variables: { id } }],
  });
  //   console.log('[UpdateProduct] ', { updateData, updateLoading, updateError });

  // The last bit here ensures that the form fields are controlled on first render
  // See this Slack thread for more info: https://wesbos.slack.com/archives/C9G96G2UB/p1612997378318500
  if (loading || updateLoading || Object.values(inputs).join('') === '')
    return <LoadingAnimation config={{ color: '#FF0000' }} />;
  //   if (error) return <p>Error: {error.message}</p>;
  if (error || updateError)
    return <DisplayError error={error || updateError} />;

  //   if (updateLoading) return <LoadingAnimation config={{ color: '#FF0000' }} />;
  //   //   if (updateError) return <p>Error: {updateError.message}</p>;
  //   if (updateError) return <DisplayError error={updateError} />;

  return (
    <Form
      onSubmit={async (e) => {
        e.preventDefault();
        // console.log(inputs);
        try {
          //   console.log('[UpdateProduct] 3: ', {
          //     name,
          //     price,
          //     description,
          //     inputs,
          //   });
          // submit the inputs to the backend
          const res = await updateProduct();
          //   console.log('update res: ', res);
          //   clearForm();
          // go to the products page
          // XXX: Unsure if we need this, as we probably just want to refresh the data in the form post-update
          /* 
          Router.push({
            // could also use the data object we destrctured from the
            // useMutation hook above to get the id of the new product
            pathname: `/product/${res.data.updateProduct.id}`,
            // TODO: Consider creating a custom slug for each product
            //       when it is added to the database, and then using
            //       that slug instead of the product id in the link
            //       to the product page. (Next.js supports this)
          });
          */
        } catch (error) {
          console.error('[UpdateProduct] submission error: ', error);
        }
      }}
    >
      <Head>
        <title>Sick Fits | Edit: {name}</title>
      </Head>
      <DisplayError error={error || updateError} />
      <fieldset disabled={updateLoading} aria-busy={updateLoading}>
        {/* TODO: Wire up image update/replacement as well */}
        {/* TODO: Fix the reset of this form element on submit -- it currently retains the submitted value */}
        {/*       Refer to this post for an idea of how to handle this: */}
        {/*       https://thewebdev.info/2021/05/29/how-to-reset-a-file-inputs-value-in-react/ */}
        {/* <img
          src={photo?.image?.publicUrlTransformed}
          alt={photo?.altText || name}
        />
        <label htmlFor="image">
          Image:
          <input required type="file" name="image" onChange={handleChange} />
        </label> */}
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
        <button type="submit">
          <FontAwesomeIcon icon={faPencil} /> Update Product
        </button>
      </fieldset>
    </Form>
  );
}

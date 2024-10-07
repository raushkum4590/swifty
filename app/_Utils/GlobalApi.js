import { request, gql } from 'graphql-request'; // Import with ES6 syntax

const MASTER_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL; // Make sure this URL is set correctly in your .env

// Function to fetch categories
const GetCategory = async () => {
  const query = gql`
    query Categories {
      categories(first: 20) {
        slug
        name
        id
        icon {
          url
        }
      }
    }
  `;

  try {
    const result = await request(MASTER_URL, query);
    return result.categories; // Return only the categories array
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error; // Propagate error for handling in the calling component
  }
};

// Function to fetch restaurants
const GetResturents = async () => {
  const query = gql`
    query Resturents {
      resturents {
        about
        address
        banner {
          url
        }
        category {
          name
        }
        id
        name
        restroType
        slug
        workingHour
      }
    }
  `;

  try {
    const result = await request(MASTER_URL, query);
    return result.resturents; // Return only the restaurants array
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    throw error; // Propagate error for handling in the calling component
  }
};


const GetResturentDetails = async (ResturentSlug) => {
  const query = gql`
    query ResturentDetails($slug: String!) {
      resturent(where: { slug: $slug }) {
        about
        address
        banner {
          url
        }
        category {
          name
        }
        id
        name
        restroType
        slug
        workingHour
        menu {
          ... on Menu {
            id
            category
            menuItem {
              ... on MenuItem {
                id
                name
                price
                productImage {
                  url
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const result = await request(MASTER_URL, query, { slug: ResturentSlug }); // Pass slug as variable
    return result.resturent; // Return the restaurant details
  } catch (error) {
    console.error("Error fetching restaurant details:", error);
    throw error; // Propagate error for handling in the calling component
  }
};

// Function to create user cart
// Function to create user cart
const GetUserCart = async (data) => {
  const mutation = gql`
    mutation AddToCart($email: String!, $price: Float!, $description: String!, $image: String!, $name: String!) {
      createUserCart(
        data: {
          email: $email, 
          price: $price, 
          productDescription: $description, 
          productImage: $image, 
          productName: $name,
          
        }
      ) {
        id
        history { 
          id 
        }
      }
      publishManyUserCarts(to: PUBLISHED) {
        count
      }
    }
  `;

  const variables = {
    email: data.email,
    price: data.price,
    description: data.description,
    image: data.image,
    name: data.name ,
    // Added productName to the variables
  };

  // Log the mutation and variables for debugging
  console.log("Mutation:", mutation);
  console.log("Variables:", variables);

  try {
    const result = await request(MASTER_URL, mutation, variables);
    return result.createUserCart; // Return the cart details
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error; // Propagate error for handling in the calling component
  }
};


export default {
  GetCategory,
  GetResturents,
  GetResturentDetails,
  GetUserCart, // Not CreateUserCart
};

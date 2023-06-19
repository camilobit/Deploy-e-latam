import { createSlice } from "@reduxjs/toolkit";
import axios from 'axios';

export const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    categories: [],
    country: "ARG",
    detail: {},
    allProducts: [],
    orderByName: 'asc',
    orderByPrice: 'mayormenor',
  },
  
  reducers: {
    setProductByCountryCategory: (state, action) => {
      state.categories = action.payload;
    },

    setAllProductsByCountries: (state, action) => {
      state.products = action.payload;
    },

    setProductsCountry: (state, action) => {
      state.country = action.payload;
    },

    setAllProducts: (state, action) => {
      state.allProducts = action.payload;
    },

    setAllProductsByCountriesCategoryId: (state, action) => {
      state.detail = action.payload;
    },
    
    setSearchProduct: (state, action) => {
      state.allProducts = action.payload;
    },

    setNewProduct: (state, action) => {
      state.products = [...state.products, action.payload];
    },

    cleanDetail:(state)=>{
      state.detail= {}
    },
    
    setOrderByName: (state, action) => {
      state.orderByName = action.payload;
      state.products.sort((a, b) => {
        if (state.orderByName === 'asc') {
          return a.title.localeCompare(b.title);
        } else if (state.orderByName === 'des') {
          return b.title.localeCompare(a.title);
        }
        return 0;
      });
    },

    setOrderByPrice: (state, action) => {
        state.orderByPrice = action.payload;
        state.products?.sort((a, b) => {
          const priceA = parseFloat(a.price);
          const priceB = parseFloat(b.price);
          if (state.orderByPrice === 'menormayor') {
            if (priceA < priceB) {
              return  1;
            }
            if (priceA > priceB) {
              return -1;
            }
            return 0;
          } else if (state.orderByPrice === 'mayormenor') {
            if (priceA > priceB) {
              return -1;
            }
            if (priceA < priceB) {
              return 1;
            }
            return 0;
          }
          return 0;
        });
    },
    setFilterByCategory: (state, action) => {
      const filterByCategory = state.allProducts;
      const filteredCat = filterByCategory.filter((product) => {
        return product.categories === action.payload;
      });

      if (action.payload === 'all') {
        state.products = state.allProducts;
      } else {
        state.products = filteredCat;
      }
    },
    
  },
});

export const {
  setProductByCountryCategory,
  setAllProductsByCountries,
  setProductsCountry,
  setAllProductsByCountriesCategoryId,
  setSearchProduct,
  setAllProducts,
  setNewProduct,
  setOrderByName,
  setOrderByPrice,
  setCategory,
  filterByCategory,
  cleanDetail,
  setFilterByCategory,
} = productSlice.actions;

export default productSlice.reducer;

export const axiosAllProductByCountryCategory = () => (dispatch, getState) => {
  const countryId = getState().products.country;
  const category = getState().products.categories;
  axios
    .get(`http://localhost:8000/products/${countryId}/${category}`)
    .then((response) => {
      dispatch(setProductByCountryCategory(response.data.data));
    })
    .catch((error) => console.log(error));
};

export const axiosAllProductsByCountries = (id) => (dispatch) => {
    axios
        .get(`http://localhost:8000/products/${id}`)
        .then((response) => {
            dispatch(setProductsCountry(id))
            dispatch(setAllProductsByCountries(response.data))
        })
        .catch((error) => console.log(error));
};



export const axiosAllProducts = () => (dispatch) => {
    const urls = [
        'http://localhost:8000/products/ARG',
        'http://localhost:8000/products/COL',
        'http://localhost:8000/products/MEX'
    ];
    const requests = urls.map(url => axios.get(url));
    Promise.all(requests)
        .then((responses) => {
            const allProducts = responses.map(response => response.data);
            dispatch(setAllProducts(allProducts));

        })
        .catch((error) => console.log(error));
};



export const axiosAllProductByCountryCategoryId = (id, countryId, categories) => (dispatch) => {
    axios
        .get(`http://localhost:8000/products/${countryId}/${categories}/${id}`)
        .then((response) => {
            dispatch(setAllProductsByCountriesCategoryId(response.data))
        })
        .catch((error) => console.log(error));
};

export const axiosSearchProduct = (title,country) => (dispatch) => {
    axios
        .get(`http://localhost:8000/products/search/?title=${title}&country=${country}`)
        .then((response) => {
            dispatch(setSearchProduct(response.data))
        })
        
        .catch((error) => console.log(error));
};


export const postProduct = (payload) => (dispatch) => {
    axios
      .post("http://localhost:8000/products/new", payload)
      .then((response) => {
            dispatch(setNewProduct(response.data.data));
      })
      .catch((error) => console.log(error));
  };
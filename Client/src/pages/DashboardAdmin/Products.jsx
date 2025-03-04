import React from 'react'
import Sidebar from '../ComponentsAdmin/SideBar/SideBar'
import AllProductsAdmin from '../ComponentsAdmin/Products/AllProductsAdmin'
import Providers from "@/redux/provider/Provider";
import TableProducts from '../ComponentsAdmin/Products/TableProducts'
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { axiosAllProductsByCountries } from "../../redux/slice/productSlice"
import StylesAdmin from "../styles/DashboardAdmin/DashboardAdmin.module.css"




const Products = () => {
  const dispatch = useDispatch();
    const productsCountry = useSelector((state) => state.products.country);
    useEffect(() => {
        dispatch(axiosAllProductsByCountries(productsCountry));
    }, [dispatch, productsCountry]);
    const array = useSelector((state) => state.products.products);
    const concatenatedObjects = array.reduce((accumulator, currentArray) => {
        return accumulator.concat(currentArray);
    }, []);
    
    let currentProducts = concatenatedObjects;
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(50);
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const paginatedProducts = currentProducts.slice(
        indexOfFirstProduct,
        indexOfLastProduct
    );
    const [orden, setOrden] = useState('');
    const paginado = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const [isOpen, setIsOpen] = useState(false);




  return (
    <div className={StylesAdmin.containerAdmin} >
    <Sidebar />
    <div className={StylesAdmin.containerHomeAdmin}style={{ marginLeft: isOpen ? '120px' : (!isOpen && '60px') }}>
    <div className={StylesAdmin.containerSuperior}>
    </div>


    <div className={StylesAdmin.containerProducts}>
            
    <TableProducts
              key="paginado"
              productsPerPage={productsPerPage}
              products={currentProducts.length}
              paginado={paginado}
              currentProducts={paginatedProducts}
            />
            <AllProductsAdmin currentProducts={paginatedProducts} />
    </div>
            </div>
    </div>
  )
}


const ProductsWithProvider = () => {
  return (
      <Providers>
          <Products/>
          
      </Providers>
  );
};


export default ProductsWithProvider;
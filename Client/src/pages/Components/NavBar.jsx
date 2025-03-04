import Link from "next/link";
import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import Styles from "./Styles/NavBar.module.css";
import { axiosAllProductsByCountries, axiosSearchProduct } from "../../redux/slice/productSlice";
import Image from "next/image";
import { useRouter } from "next/router"
import Select from 'react-select'


const NavBar = () => {

  const router = useRouter();
  const dispatch = useDispatch();
  const productsCountry = useSelector((state) => state.products.country);
  const [title, setTitle] = useState('');
  const [country, setCountry] = useState('ARG');
  const [showModal, setShowModal] = useState(false);
  const options = [
    { value: 'ARG', /* label: ' Argentina' */ img: 'https://flagcdn.com/w20/ar.png' },
    { value: 'COL', /* label: ' Colombia' */ img: 'https://flagcdn.com/w20/co.png' },
    { value: 'MEX', /* label: ' México' */ img: 'https://flagcdn.com/w20/mx.png' },
  ];

  function handleSearch(event) {
    setTitle(event.target.value);
  }

  const handlerClick = async () => {
    if (title.trim() === '') {
      setShowModal(true);
    } else {
      let selectedCountry = '';

      if (country === 'ARG') {
        selectedCountry = 'Argentina';
      } else if (country === 'COL') {
        selectedCountry = 'Colombia';
      } else if (country === 'MEX') {
        selectedCountry = 'Mexico';
      }

      try {
        await dispatch(axiosSearchProduct(title, selectedCountry));
        setTitle('');

      } catch (error) {
        setShowModal(true);
      }
    }
  };

  function handleFilterByCountry(event) {
    const selectedValue = event.value;
    setCountry(selectedValue);
    dispatch(axiosAllProductsByCountries(selectedValue));
  }
  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className={Styles.navbar}>
      <div className={Styles.leftContainer}>
        <Link className={Styles.logo} href="/">
          <div className={Styles.logoContainer}>
            <Image
              className={Styles.logoE}
              src="/assets/e-world.png"
              width={100}
              height={100}
              alt="Animación1"
            />
            <Image
              className={Styles.logoLam}
              src="/assets/latam-store.png"
              width={100}
              height={100}
              alt="Animación2"
            />
          </div>
        </Link>

        <div className={Styles.flags}>
          <Select
            options={options}
            value={options.find(option => option.value === country)}
            onChange={handleFilterByCountry}
            isSearchable={false}
            getOptionLabel={option => (
              <div>
                <img src={option.img} alt={option.label} className={Styles.flagIcon} />
                {option.label}
              </div>
            )}
            getOptionValue={option => option.value}
          />
        </div>

        {/* {router.pathname === "/Home" &&
          <div className={Styles.flags}>
            <select value={country} onChange={handleFilterByCountry}>
              <option value="ARG">ARG</option>
              <option value="COL">COL</option>
              <option value="MEX">MEX</option>
            </select>
          </div>
        } */}
        {showModal && (
          <div className={Styles.modal}>
            <div className={Styles.modalContent}>
              <h2>Error de búsqueda</h2>
              <p>Por favor, ingresa algún dato válido antes de realizar la búsqueda.</p>
              <button className={Styles.closeButton} onClick={handleCloseModal}>Cerrar</button>
            </div>
          </div>
        )}

        {router.pathname === "/Home" &&
          <div className={Styles.searchBar}>

            <input type="search" placeholder="¿Qué buscas hoy?" value={title} onChange={handleSearch} />
            <button onClick={handlerClick} className={Styles.buttonBusqueda}>Buscar</button>


          </div>
        }
      </div>

      <div className={Styles.rightContainer}>
        <Link className={Styles.cartButton} href="/Cart" >
          <Image
            className={Styles.iconCarrito}
            src="/assets/CarritoVioleta.png"
            width={100}
            height={100}
            alt="cart_icon"
          >
          </Image>
        </Link>
        <Link className={Styles.button} href="/CreateProduct">New</Link>
        <button className={Styles.button}>Login</button>
        <Link className={Styles.button} href="/DashboardAdmin">Admin</Link>
      </div>
    </div>
  );
};

export default NavBar;

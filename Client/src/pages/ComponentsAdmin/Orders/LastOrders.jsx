import React from 'react'
import { data } from './Data';
import { FaShoppingBag } from 'react-icons/fa'
import Styles from './LastOrders.module.css'

const LastOrders = () => {
  return (
    <div className={Styles.container}>
      <h1>Recent Orders</h1>
      <ul>
        {data.map((order, id) => (
          <li
            key={id}
            className={Styles.order}
          >
            <div className={Styles.faShop}>
              <FaShoppingBag className='text-blue-800' />
            </div>
            <div className={Styles.textContainer}>
              <p className='text-gray-800 font-bold'>${order.total}</p>
              <p className='text-gray-400 text-sm'>{order.name.first}</p>
            </div>
            <p className={Styles.date}>{order.date}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LastOrders
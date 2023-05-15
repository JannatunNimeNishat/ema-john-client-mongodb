import React from 'react';
//css
import './ReviewItem.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
const ReviewItem = ({product,handleRemoveFromCart}) => {
    const {img,_id,quantity,price,name} = product;
    return (
        <div className='review-item'>
            <img src={img} alt="" />
            <div className="review-details">
                <p className='product-title'>{name}</p>
                <p>Price: <span className='orange-text'>${price}</span></p>
                <p>Order Quantity: <span className='orange-text'>{quantity}</span></p>
            </div>
            <button onClick={()=>handleRemoveFromCart(_id)}  className='btn-delete'>
                <FontAwesomeIcon className='delete-icon' icon={faTrashAlt}/>
            </button>
        </div>
    );
};

export default ReviewItem;
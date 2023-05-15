import React, { useEffect, useState } from 'react';
import { addToDb, deleteShoppingCart, getShoppingCart } from '../../utilities/fakedb';
import Cart from '../Cart/Cart';
import Product from '../Product/Product';
import './Shop.css';
import { Link, useLoaderData } from 'react-router-dom';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([])

    /**Pagination */
    // getting total number of products from db for pagination
    const { totalProducts } = useLoaderData();

    // const itemsPerPage = 10; //TODO make it dynamic
    //user will decide how many product he wants to see in a single page 
    const [itemsPerPage, setItemsPerPage] = useState(10)

    const totalPages = Math.ceil(totalProducts / itemsPerPage);

    //current Page 
    const [currentPage, setCurrentPage] = useState(0)



    //create buttons dynamically for the pagination using the total pages
    /* const pageNumbers = []
    for(let i=0;i<=totalPages;i++){
        pageNumbers.push(i);
    } */

    //or

    //same operation as pageNumber but less code
    //note array is also an object in javascript so keys are mainly the index number. {0:undefined, 1:undefined, and so on } so .keys() is the index number
    const pageNumbers = [...Array(totalPages).keys()]

    //we can make itemPerPage dynamic. Ny taking a select and take input from user. user will decide how many product he wants to see in a single page 

    const options = [5, 10,15, 20];
    //    const options = [5];
    console.log('totalProducts: ', totalProducts, 'totalPages: ', totalPages);

    //change the number of products per page
    function handleSelectChange(event) {
        setItemsPerPage(parseInt(event.target.value))
        setCurrentPage(0)
    }


    /**
     * DONE: 1. Determine total number of items.
     * TODO: 2. Decide the number of items per page.
     * DONE: 3. Calculate the total number of pages.
     *       4. Determine the current page
     * 
     * 
     */


    /*     useEffect(() => {
            fetch('http://localhost:5000/products')
                .then(res => res.json())
                .then(data => setProducts(data))
        }, []); */

    //load data based on current page (pagination)
    useEffect(() => {
        async function fetchData() {
            const response = await fetch(`http://localhost:5000/products?page=${currentPage}&limit=${itemsPerPage}` );
            const data = await response.json()
            setProducts(data)
        }
        fetchData()
    }, [currentPage,itemsPerPage])


    useEffect(() => {
        const storedCart = getShoppingCart();
        const savedCart = [];
        // step 1: get id of the addedProduct
        for (const id in storedCart) {
            // step 2: get product from products state by using id
            const addedProduct = products.find(product => product._id === id)
            if (addedProduct) {
                // step 3: add quantity
                const quantity = storedCart[id];
                addedProduct.quantity = quantity;
                // step 4: add the added product to the saved cart
                savedCart.push(addedProduct);
            }
            // console.log('added Product', addedProduct)
        }
        // step 5: set the cart
        setCart(savedCart);
    }, [products])

    const handleAddToCart = (product) => {
        // cart.push(product); '
        let newCart = [];
        // const newCart = [...cart, product];
        // if product doesn't exist in the cart, then set quantity = 1
        // if exist update quantity by 1
        const exists = cart.find(pd => pd._id === product._id);
        if (!exists) {
            product.quantity = 1;
            newCart = [...cart, product]
        }
        else {
            exists.quantity = exists.quantity + 1;
            const remaining = cart.filter(pd => pd._id !== product._id);
            newCart = [...remaining, exists];
        }

        setCart(newCart);
        addToDb(product._id)
    }
    const handleClearCart = () => {
        setCart([]);
        deleteShoppingCart();
    }
    return (
        <>
            <div className='shop-container'>
                <div className="products-container">
                    {
                        products.map(product => <Product
                            key={product._id}
                            product={product}
                            handleAddToCart={handleAddToCart}
                        ></Product>)
                    }
                </div>
                <div className="cart-container">
                    <Cart
                        cart={cart}
                        handleClearCart={handleClearCart}
                    >
                        <Link className='proceed-link' to='/orders'>
                            <button className='btn-processed'>Review Order</button>
                        </Link>
                    </Cart>
                </div>
            </div>
            {/* pagination */}
            <div className='pagination'>
                <p>Current page: {currentPage}</p>
                {
                    pageNumbers.map(number => <button
                        className={currentPage === number ? `selected` : ``}
                        key={number}

                        onClick={() => setCurrentPage(number)}
                    >
                        {number}
                    </button>)
                }
                {/* user will decide how many product he wants to see in a single page  */}

                <select value={itemsPerPage} onChange={handleSelectChange}>
                    {
                        /*  options.map(option => {
                             <option key={option} value={option}>
                                 1
                             </option>
 
                         }) */
                        options.map(option => (

                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))


                    }

                </select>
            </div>
        </>
    );
};

export default Shop;
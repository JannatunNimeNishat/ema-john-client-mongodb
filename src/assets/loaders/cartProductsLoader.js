import { getShoppingCart } from "../../utilities/fakedb";

/*
* This function fetch data from products.json, and then find the added product in shopping cart using local storage 
 * update the quantity of the founded product and push it in a new array. and then return the array of object that contain all the added cart products
 */
const cartProductsLoader = async () => {
    const loadedProducts = await fetch('products.json');
    const products = await loadedProducts.json();
    // console.log(products);

    const storedCard = getShoppingCart();
    const savedCard = [];
    console.log('storedCard: ', storedCard);
    for (const id in storedCard) {
        const addedProduct = products.find(product => product.id === id);
        if (addedProduct) {
            const quantity = storedCard[id];
            addedProduct.quantity = quantity;
            savedCard.push(addedProduct);
        }
    }
    return savedCard;

    /*if we need to send two things from an function we can do it in two ways
    1. push elements in a array then send the array
        return [products, savedCart]
    2. add the elements to an object then send the object
        return {product,savedCard}
        or
       return {product: product, savedCart: savedCart}
    */

}


export default cartProductsLoader;



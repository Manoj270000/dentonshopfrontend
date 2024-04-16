import React, { useEffect, useState } from 'react';
import './ProductsHome.css';
import configDetails from '../Config/Config';
import '../Admin/Styles/Spinner.css'

const Home = ({ userEmail, authIdToken }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState({});
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [cart, setCart] = useState({});
  const [existingCart, setExistingCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingCart, setIsUpdatingCart] = useState(false);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);

      const productsApi = `${configDetails.baseUrl}${configDetails.allProducts}`;
      const productsResponse = await fetch(productsApi, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          'Authorization':authIdToken
        }
      });
      if (productsResponse.ok) {
        const fetchedProducts = await productsResponse.json();
        setProducts(fetchedProducts);

        const categoryObj = {};
        fetchedProducts.forEach((product) => {
          categoryObj[product.category] = true;
        });
        setCategories(categoryObj);
      } else {
        console.error('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCartItems = async (userEmail) => {
    try {
      setIsLoading(true);

      const cartItemsApi = `${configDetails.baseUrl}${configDetails.getUserCartItems}?email=${userEmail}`;
      const cartItemsResponse = await fetch(cartItemsApi, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          'Authorization':authIdToken
        }
      });
      if (cartItemsResponse.ok) {
        const fetchedExistingCart = await cartItemsResponse.json();
        setExistingCart(fetchedExistingCart);
        updateCartLocally(fetchedExistingCart);
      } else {
        console.error('Failed to fetch existing cart items');
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // This effect does not depend on userEmail, so it only runs once on component mount
  }, []); // Empty dependency array means this runs once on mount

  useEffect(() => {
    if (userEmail) {
      fetchCartItems(userEmail);
    }
    // This effect depends on userEmail, so it runs on mount and whenever userEmail changes
  }, [userEmail]);


  const updateCartLocally = (fetchedExistingCart) => {
    const updatedCart = {};
    fetchedExistingCart.forEach((item) => {
      updatedCart[item.product.id] = item.quantity;
    });
    setCart(updatedCart);
  };

  const addToCart = async (productId, quantity, up) => {
    try {
      setIsUpdatingCart(true); 
      
      const product = products.find((product) => product.id === productId);
      
      if (product && product.quantityAvailable < quantity) {
        alert(`${product.quantityAvailable} in stock.`);
        return; 
      }
      
      const api = `${configDetails.baseUrl}${configDetails.addItemToCart}?id=${productId}&email=${userEmail}&quantity=${quantity}`;
      const response = await fetch(api, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization':authIdToken
        }
      });
      if (response.ok) {
        console.log('Item added to cart successfully');
        const updatedCart = [...existingCart];
        const existingCartItemIndex = updatedCart.findIndex((item) => item.product.id === productId);
        if (existingCartItemIndex !== -1) {
          updatedCart[existingCartItemIndex].quantity += up;
        } else {
          updatedCart.push({ product: products.find((product) => product.id === productId), quantity });
        }
        setExistingCart(updatedCart);

        setCart((prevCart) => ({
          ...prevCart,
          [productId]: quantity
        }));
        
      } else {
        console.error('Failed to add item to cart');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsUpdatingCart(false); 
    }
  };

  const handleAddToCart = (productId) => {
    const newQuantity = (cart[productId] || 0) + 1;
    addToCart(productId, newQuantity);
    setCart((prevCart) => ({
      ...prevCart,
      [productId]: newQuantity
    }));
  };

  const handleIncreaseQuantity = (productId) => {
    const newQuantity = (cart[productId] || 0) + 1;
    let incre = 1;
    addToCart(productId, newQuantity, incre);
  };

  const handleDecreaseQuantity = (productId) => {
    if (cart[productId] > 1) {
      const newQuantity = cart[productId] - 1;
      let decre = -1;
      addToCart(productId, newQuantity, decre);
      setCart((prevCart) => ({
        ...prevCart,
        [productId]: newQuantity
      }));
    } else if (cart[productId] === 1) {
      addToCart(productId, 0);
      const updatedCart = { ...cart };
      delete updatedCart[productId];
      setCart(updatedCart);
    }
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    );
  };

  const getFilteredProducts = () => {
    return products.filter((product) => {
      return selectedCategories.length === 0 || selectedCategories.includes(product.category);
    });
  };

  useEffect(() => {
      fetchProducts();
  }, []); 


  if (isLoading) {
    return <div className="loading-container">
              <div className="loading-spinner"></div>
              <p style={{textAlign:'center'}}>Loading Products...</p> 
            </div>;
  }

  return (
    <div>
      <div className="filters" style={{ display: 'flex', alignItems: 'center', backgroundColor:'lightgrey', borderRadius:'10px', margin:'20px' }}>
        <button onClick={fetchProducts} style={{width:'auto', backgroundColor:'green'}}>Fetch Products</button>
        <h4 style={{ margin: '20px' }}> Filter by Categories</h4>
        {Object.keys(categories).map((category) => (
            <div key={category} style={{ margin: '20px' }}>
            <input
                type="checkbox"
                id={`cat-${category}`}
                checked={selectedCategories.includes(category)}
                onChange={() => handleCategoryChange(category)}
                style={{ marginRight: '5px' }} 
            />
            <label htmlFor={`cat-${category}`}>{category}</label>
            </div>
        ))}
        </div>

      <div className="product-container" style={{margin:'20px'}}>
        {getFilteredProducts().map((product, index) => (
          <div key={index} className="product-item">
            {product.imageUrls ? 
                  (<img src={product.imageUrls} alt="Product" style={{ width: '200px', height: '200px' }} />
                    ) : (
                        <img src="https://jmva.or.jp/wp-content/uploads/2018/07/noimage.png" alt="No Image" style={{ width: '200px', height: '200px' }} />
                    )}
            <h3>{product.name}</h3>
            <p><strong>Description:</strong> {product.description} <strong>by {product.manufacturer}</strong></p>
            <p>Price: ${product.price}, Available:<strong>{product.quantityAvailable}</strong></p>
            {cart[product.id] > 0 ? (
              <div className="quantity-controls">
                <button className="small-button" style={{width:'auto'}} onClick={() => handleDecreaseQuantity(product.id)}>-</button>
                <span>{cart[product.id]}</span>
                <button className="small-button" style={{width:'auto'}} onClick={() => handleIncreaseQuantity(product.id)}>+</button>
              </div>
            ) : (
              <button className="add-to-cart-button" style={{width:'auto'}} onClick={() => handleAddToCart(product.id)}>Add to Cart</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;

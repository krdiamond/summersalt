import Head from 'next/head';
import styles from '../styles/Home.module.css';
import React, { useEffect, useState, useRef } from 'react';

export default function Home() {

  const [products, setProducts] = useState([]);
  // fetch product data from the API provided and set it to 'products'
  // When the user scrolls to the bottom of the container and the API fetches again, the previous products will stay at the beginging of the array and the new products will be added to the end of the array each time.
  // in the component below, products is looped over using a .map function to transform the original products array into a new array of elements to represent each product as a component that can be rendered by React

  const [page, setPage] = useState(1);
  // updates the page number that the API should call.   
  // This function doesn't directly trigger the next API call.  Instead, it updates the pageNumber state variable which tiggers a re-render of the component.
  // This triggers useEffect to run again and make a new API call with the new page number stored as a variable interpolated inside the API link

  const [loading, setLoading] = useState(false);
  // This captures when the new API is being fetched (true/false),  This happens quickly and is only seen for a split second.
  // This is only set as a dependancy for the handleScroll useEffect so this rerender does not affect the fetchData function

  const containerRef = useRef(null);
  //set container to use for scrolling box. When the user scrolls to the end of this container, will fetch the next page of the API
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); //set to true only for a split second when the api is being called
      const response = await fetch(`https://summersalt.com/collections/swimwear/products.json?page=${page}&limit=6`);
      const data = await response.json();
      setProducts((prevProducts) => [...prevProducts, ...data.products]); //updates the products array with either the first render of page 1, and then adds products to the end of the array after rerenders are triggeredd by page updates
      setLoading(false); //quickly back to false
    };

    fetchData();
  }, [page]); // as a dependancy setPage will rerender the component and this function will be called

  useEffect(() => {
    const container = containerRef.current; //creates a variable for the container set with useRef 
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container; //sets variables for all the positions needed to know when the user is at the bottom of the container to do another API call

      if (scrollHeight - scrollTop === clientHeight && !loading) { // if a user is at the right place to make a new API and nothing is currently loading this will increase the page by 1
        console.log('Fetching next page...'); //just checking to make sure the new page is being called correctly
        setPage((prevPage) => prevPage + 1);  //function to update the page's state to the next page
      }
    };

    container.addEventListener('scroll', handleScroll); //adds an event listener on the container

    return () => { //returning a function inside the useEffect hook can be good for cleanup when the component unmounts. 
      container.removeEventListener('scroll', handleScroll); // remove the event listnener To prevent any potential issues that might occur if the event listener is still attached to the component after it has been unmounted.
    };

  }, [loading]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Summersalt Code Challenge</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className={styles.title}>
          Summersalt Code Challenge
        </h1>

        <div ref={containerRef}  className={styles.scroll_grid}>
          <div className={styles.flex}>
            {products.map((product) => (
              <div key={product.id} className={styles.card}>
                <h2><a href={`https://www.summersalt.com/products/${product.handle}`}>{product.title}</a></h2>
                <a href={`https://www.summersalt.com/products/${product.handle}`}><img className={styles.product_image} src={product.images[0].src} alt={product.title} /></a>
              </div>
            ))}
          </div>
        </div>
        
        <div className={styles.loading}>
          {loading && <p>Loading...</p>}
        </div> 

      </main>

      <footer>
       
      </footer>
    </div>
  )
}

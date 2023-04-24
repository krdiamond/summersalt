import Head from 'next/head';
import styles from '../styles/Home.module.css';
import React, { useEffect, useState, useRef } from 'react';

export default function Home() {

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await fetch(`https://summersalt.com/collections/swimwear/products.json?page=${page}&limit=6`);
      const data = await response.json();
      setProducts((prevProducts) => [...prevProducts, ...data.products]);
      setLoading(false);
    };

    fetchData();
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      const { scrollTop, scrollHeight, clientHeight } = container;

      if (scrollHeight - scrollTop === clientHeight && !loading) {
        console.log('Fetching next page...');
        setPage((prevPage) => prevPage + 1);
      }
    };

    const container = containerRef.current;
    container.addEventListener('scroll', handleScroll);

    return () => {
      container.removeEventListener('scroll', handleScroll);
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
          {loading && <p>Loading...</p>}
        </div>

      </main>

      <footer>
       
      </footer>
    </div>
  )
}

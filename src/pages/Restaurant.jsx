import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const Restaurant = () => {
  const { id } = useParams();
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchapi = async () => {
      try {
        const response = await fetch(
          `https://www.swiggy.com/dapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=26.490642&lng=80.3093933&restaurantId=${id}`
        );
        const newdata = await response.json();
        console.log('Menu data:', newdata);

        // Extract only info from cards[2]
        //var item = newdata?.data?.cards?.[2]?.card?.card?.info; 
        var item = newdata?.data?.cards?.[4]?.groupedCard?.cardGroupMap?.REGULAR?.cards?.[1]?.card?.card?.carousel;
        console.log('Extracted item:', item);
        var nameIs = item?.name;
        console.log('Extracted name:', nameIs);
        setMenu(item ? [item] : []); // Wrap in array if your component expects a list
        // if (item) {
        //   console.log('Extracted item:', item);
        //   setMenu([item]); // wrap in array if your component expects a list
        // } else {
        //   setMenu([]);
        // }
      } catch (e) {
        console.error("Fetch error:", e);
        setMenu([]);
      } finally {
        setLoading(false);
      }
    };
    fetchapi();
  }, [id]);
  

  return (
    <div>
      <h1>Restaurant Menu</h1>
      {loading ? (
        <p>Loading menu...</p>
      ) : menu.length > 0 ? (
        <ul>
          {menu.map((item, idx) => (
            <li key={item.id || idx}>
              {item.name} {item.costForTwo ? `- ₹${item.costForTwo / 100}` : ''}
            </li>
          ))}
        </ul>
      ) : (
        <p>No menu items found.</p>
      )}
    </div>
  );
};

export default Restaurant;

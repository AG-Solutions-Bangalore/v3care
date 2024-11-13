
import React from "react";

import Layout from "../../layout/Layout";
import Cards from "./cards/Cards";
import Jobs from "./jobs/Jobs";
import BookingOrder from "./bookingOrders/BookingOrder";




const Home = () => {
  return (
    <Layout>
      <div className=" p-2">
        <div className="mt-2">
          <Cards />
        
        </div>
        <div className="mt-4">
          <Jobs />
        </div>
        <div className="mt-4">
          <BookingOrder />
        </div>
      </div>
    </Layout>
  );
};

export default Home;

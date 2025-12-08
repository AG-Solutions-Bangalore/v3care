import { useContext, useEffect, useState } from "react";

import axios from "axios";
import { BASE_URL } from "../../base/BaseUrl";
import Layout from "../../layout/Layout";
import { ContextPanel } from "../../utils/ContextPanel";
import BookingOrder from "./bookingOrders/BookingOrder";
import Cards from "./cards/Cards";
import Jobs from "./jobs/Jobs";
import Revenue from "./revenue/Revenue";
import { toast } from "react-toastify";




const Home = () => {
  const [loading, setLoading] = useState(false);
  const { currentYear, userType } = useContext(ContextPanel);
  const [data, setData] = useState({});

  const fetchData = async () => {
    if (currentYear) {
      setLoading(true);
      try {
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-dashboard-data/${currentYear}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching booking data:", error);
        toast.error("Failed to fetch dashboard data");
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }
  };
  useEffect(() => {
    fetchData();
  }, [currentYear]);
  return (
    <Layout>
      <div className=" p-2">
        <div className="mt-2">
          <Cards datas={data} loading={loading} />
        </div>

        <div
          className={`grid gap-4  ${
            userType == 8 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 "
          }`}
        >
          {" "}
          <div className="mt-4">
            <Jobs loading={loading} datas={data} userType={userType} />
          </div>
          {userType == 8 && (
            <div className="mt-4">
              <Revenue loading={loading} datas={data} userType={userType} />
            </div>
          )}
        </div>

        <div className="mt-4">
          <BookingOrder loading={loading} datas={data} fetchData={fetchData} />
        </div>
      </div>
    </Layout>
  );
};

export default Home;

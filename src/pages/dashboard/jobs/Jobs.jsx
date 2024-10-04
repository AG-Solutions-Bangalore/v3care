import React from "react";

import { useEffect, useState } from "react";
import BASE_URL from "../../../base/BaseUrl";
import axios from "axios";

const Jobs = () => {
  const dateyear = ["2024-25"];
  const [data, setDate] = useState([]);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("id");
    if (!isLoggedIn) {
      navigate("/"); // Navigate if not logged in
      return;
    }

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-dashboard-data/${dateyear}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setDate(response.data);
      } catch (error) {
        console.error("Error fetching booking data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <div>
        <h1 className="text-black text-xl font-bold">Today Jobs</h1>
      </div>
      <div className="grid md:grid-cols-6 gap-4 grid-cols-2 mt-4">
        <div className="bg-white text-[#464D69] shadow-lg rounded-lg p-3 font-semibold text-center">
          <h1 className="text-xl ">{data.booking_Inspection_today}</h1>
          <h1 className="text-xl ">Inspection</h1>
        </div>
        <div className="bg-white text-[#464D69] shadow-lg rounded-lg p-3 font-semibold text-center">
          <h1 className="text-xl ">{data.booking_Confirmed_today}</h1>
          <h1 className="text-xl ">Confirmed</h1>
        </div>
        <div className="bg-white text-[#464D69] shadow-lg rounded-lg p-3  font-semibold text-center">
          <h1 className="text-xl ">{data.booking_Vendor_today}</h1>
          <h1 className="text-xl ">Vendor</h1>
        </div>
        <div className="bg-white text-[#464D69] shadow-lg rounded-lg p-3 font-semibold text-center">
          <h1 className="text-xl ">{data.booking_way_today}</h1>
          <h1 className="text-xl ">On the Way</h1>
        </div>
        <div className="bg-white text-[#464D69] shadow-lg rounded-lg p-3 font-semibold text-center">
          <h1 className="text-xl ">{data.booking_Progress_today}</h1>
          <h1 className="text-xl ">In Progress</h1>
        </div>
        <div className="bg-white text-[#464D69] shadow-lg rounded-lg p-3 font-semibold text-center">
          <h1 className="text-xl ">{data.booking_Completed_today}</h1>
          <h1 className="text-xl ">Completed</h1>
        </div>
      </div>
    </div>
  );
};

export default Jobs;

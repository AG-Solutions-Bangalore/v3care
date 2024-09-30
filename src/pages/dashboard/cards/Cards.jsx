import React from "react";
import { useEffect, useState } from "react";
import BASE_URL from "../../../base/BaseUrl";
import axios from "axios";
const Cards = () => {
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
    <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
      <div class="bg-[rgb(138,106,106)] text-white flex items-center justify-center flex-col text-center md:h-24 md:w-68 py-4 rounded-lg  transition-transform duration-400 ">
        <p class="text-md font-bold">Pending Booking</p>
        <p class="text-2xl font-bold">{data.booking_pending_count}</p>
      </div>
      <div class="bg-blue-500 text-white flex items-center justify-center flex-col text-center md:h-24 md:w-68 py-4 rounded-lg  transition-transform duration-400 ">
        <p class="text-md font-bold">Confirmed Booking</p>
        <p class="text-2xl font-bold">{data.booking_Confirmed_count}</p>
      </div>
      <div class="bg-green-500 text-white flex items-center justify-center flex-col text-center md:h-24 md:w-68 py-4 rounded-lg  transition-transform duration-400 ">
        <p class="text-md font-bold">Today Booking</p>
        <p class="text-2xl font-bold">{data.booking_current_count}</p>
      </div>
      <div class="bg-[rgb(188,174,47)] text-white flex items-center justify-center flex-col text-center md:h-24 md:w-68 py-4 rounded-lg  transition-transform duration-400 ">
        <p class="text-md font-bold">Tomorrow Booking</p>
        <p class="text-2xl font-bold">{data.booking_tomm_count}</p>
      </div>
    </div>
  );
};

export default Cards;

import React, { useEffect, useState } from "react";
import {
  FaSearchLocation,
  FaCheckCircle,
  FaTools,
  FaTruck,
  FaSpinner,
  FaFlag,
  FaCalendarAlt,
} from "react-icons/fa";
import axios from "axios";
import { BASE_URL } from "../../../base/BaseUrl";
import { toast } from "react-toastify";

const FieldJobs = () => {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  var todayback = yyyy + "-" + mm + "-" + dd;
  const [idealData, setIdealData] = useState([]);

  useEffect(() => {
    const fetchIdealData = async () => {
      try {
        const data = { from_date: todayback };
        const token = localStorage.getItem("token");

        const response = await axios.post(
          `${BASE_URL}/api/panel-fetch-ideal-field`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const filteredAndSortedData = response.data?.stock
          ?.filter((item) => item.o_id !== "0")
          .sort((a, b) => a.branch_name.localeCompare(b.branch_name));

        setIdealData(filteredAndSortedData);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      }
    };

    fetchIdealData();
  }, []);

  return (
    <div>
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
            <FaCalendarAlt className="text-red-600 text-lg" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Today's Field Team{" "}
            </h2>
          </div>
        </div>
      </div>
      {idealData.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-6">
          {idealData.map((data, key) => (
            <div
              key={key}
              className="bg-white border border-gray-200 rounded-xl p-4 shadow hover:shadow-md transition duration-300"
            >
              <div className="flex flex-col items-center text-center">
                <div className="text-base font-semibold text-gray-800">
                  {data.name.split(" ")[0]}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {data.branch_name}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-6 text-sm">
          🚫 No data available
        </div>
      )}
    </div>
  );
};

export default FieldJobs;

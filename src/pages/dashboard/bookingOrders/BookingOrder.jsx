import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { HiMiniMinus } from "react-icons/hi2";
import { TfiReload } from "react-icons/tfi";
import { MdCancel } from "react-icons/md";
import BASE_URL from "../../../base/BaseUrl";
import Loader from "./Loader";

const BookingOrder = () => {
  const dateyear = ["2024-25"];
  const [data, setData] = useState([]);
  const [fullClose, setFullClose] = useState(true);
  const [showTable, setShowTable] = useState(true); // State to control table visibility
  const navigate = useNavigate(); // Use useNavigate hook
  const [loading, setLoading] = useState(false);

  const [reload, setReload] = useState(false);

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
      if (response.status === "200") {
        setLoading(true);
      }
      setData(response.data.booking_tomm);
    } catch (error) {
      console.error("Error fetching booking data:", error);
    } finally {
      setLoading(false);
      setReload(false); // Reset reload flag
    }
  };

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("token");
    if (!isLoggedIn) {
      navigate("/"); // Navigate if not logged in
      return;
    }
    if (reload || data.length === 0) {
      fetchData();
    }
  }, []);

  const handleReload = () => {
    setReload(true);
    console.log("Reload triggered");
  };

  const handleClose = () => {
    // Close the table
    setShowTable((prev) => !prev);
  };

  const handleFullClose = () => {
    // Close the table
    setFullClose(false);
  };

  return (
    <>
      {fullClose && (
        <div className="container mx-auto md:px-4">
          <h2 className="text-2xl text-center my-5 font-bold">
            Tomorrow's Booking Orders
          </h2>
          <div className="flex justify-between   bg-white p-4 rounded-sm">
            <div className="content-center">
              <h1>Tomorrow Booking Orders</h1>
            </div>
            <div className="flex gap-3">
              <div>
                <HiMiniMinus
                  className="text-2xl cursor-pointer"
                  onClick={handleClose}
                />
              </div>
              <div>
                <TfiReload
                  className="text-xl cursor-pointer"
                  onClick={handleReload}
                />
              </div>
              <div>
                <MdCancel
                  className="text-2xl cursor-pointer"
                  onClick={handleFullClose}
                />
              </div>
            </div>
          </div>
          {loading ? (
            <Loader />
          ) : (
            showTable && (
              <div className="flex flex-col">
                <div className="overflow-x-auto ">
                  <div className="inline-block min-w-full  ">
                    <div className="overflow-hidden">
                      <table className="min-w-full text-center text-sm font-light text-surface dark:text-white">
                        <thead className="bg-gray-400 font-medium text-white dark:border-white/10">
                          <tr>
                            <th scope="col" className="px-6 py-4">
                              ID
                            </th>
                            <th scope="col" className="px-6 py-4">
                              Branch
                            </th>
                            <th scope="col" className="px-6 py-4">
                              Customer
                            </th>
                            <th scope="col" className="px-6 py-4">
                              Mobile
                            </th>
                            <th scope="col" className="px-6 py-4">
                              Booking Date
                            </th>
                            <th scope="col" className="px-6 py-4">
                              Service Date
                            </th>
                            <th scope="col" className="px-6 py-4">
                              Service
                            </th>
                            <th scope="col" className="px-6 py-4">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.map((order, key) => (
                            <tr
                              key={key}
                              className="border-b border-neutral-200 bg-white"
                            >
                              <td className="whitespace-nowrap px-6 py-4 font-medium">
                                {order.order_ref}
                              </td>
                              <td className="whitespace-nowrap px-6 py-4">
                                {order.branch_name}
                              </td>
                              <td className="whitespace-nowrap px-6 py-4">
                                {order.order_customer}
                              </td>
                              <td className="whitespace-nowrap px-6 py-4">
                                {order.order_customer_mobile}
                              </td>
                              <td className="whitespace-nowrap px-6 py-4">
                                {moment(order.order_date).format("DD-MM-YYYY")}
                              </td>
                              <td className="whitespace-nowrap px-6 py-4">
                                {moment(order.order_service_date).format(
                                  "DD-MM-YYYY"
                                )}
                              </td>
                              <td className="whitespace-nowrap px-6 py-4">
                                {order.order_custom_price <= 1
                                  ? order.order_service
                                  : order.order_custom}
                              </td>
                              <td className="whitespace-nowrap px-6 py-4">
                                {order.order_status}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </>
  );
};

export default BookingOrder;

import React, { useContext, useEffect, useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { ContextPanel } from "../utils/ContextPanel";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../base/BaseUrl";

const OrderRefModal = ({ isOpen, onClose, orderRef }) => {
  const [orderRefData, setOrderRefData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderRefData = async () => {
      try {
        if (!isPanelUp) {
          navigate("/maintenance");
          return;
        }
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-booking-assign-by-view/${orderRef}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setOrderRefData(response.data?.bookingAssign);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderRefData();
    setLoading(false);
  }, [orderRef]);

  return (
    <Dialog open={isOpen} handler={onClose} size="xl">
      <DialogHeader>
        Booking Assign List
        <DialogFooter>
          <button
            onClick={onClose}
            className="btn btn-secondary border text-base border-black bg-red-500 text-black rounded-lg px-2"
          >
            Close
          </button>
        </DialogFooter>
      </DialogHeader>

      <DialogBody>
        <div className=" overflow-x-auto ">
          <table className="min-w-full table-auto border-collapse border border-red-300">
            <thead>
              <tr className="bg-blue-200">
                <th className="border border-black px-4 py-2 text-left text-black">
                  Full Name
                </th>
                <th className="border border-black px-4 py-2 text-left text-black">
                  Start Time
                </th>
                <th className="border border-black px-4 py-2 text-left text-black">
                  On the Way Time
                </th>
                <th className="border border-black px-4 py-2 text-left text-black">
                  End Time
                </th>
                <th className="border border-black px-4 py-2 text-left text-black">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {orderRefData?.map((dataSumm, key) => (
                <tr key={key} className="hover:bg-gray-100">
                  <td className="border border-black px-2 py-2 sm:px-4 sm:py-2 text-black text-xs sm:text-sm">
                    {dataSumm.name}
                  </td>
                  <td className="border border-black px-2 py-2 sm:px-4 sm:py-2 text-black text-xs sm:text-sm">
                    {dataSumm.order_start_time}
                  </td>
                  <td className="border border-black px-2 py-2 sm:px-4 sm:py-2 text-black text-xs sm:text-sm">
                    {dataSumm.order_way_time}
                  </td>
                  <td className="border border-black px-2 py-2 sm:px-4 sm:py-2 text-black text-xs sm:text-sm">
                    {dataSumm.order_end_time}
                  </td>
                  <td className="border border-black px-2 py-2 sm:px-4 sm:py-2 text-black text-xs sm:text-sm">
                    {dataSumm.order_assign_status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogBody>
    </Dialog>
  );
};

export default OrderRefModal;

import {
  Card,
  CardBody,
  CardHeader,
  Chip,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import moment from "moment";
import { useEffect, useState } from "react";
import { FaCalendarAlt, FaPhoneAlt, FaStore, FaUser } from "react-icons/fa";
import { HiMiniMinus } from "react-icons/hi2";
import { MdCancel } from "react-icons/md";
import { TfiReload } from "react-icons/tfi";

const BookingOrder = ({ datas, loading, fetchData }) => {
  const [data, setData] = useState([]);
  const [fullClose, setFullClose] = useState(true);
  const [showTable, setShowTable] = useState(true);
  const [reload, setReload] = useState(false);

  const getStatusColor = (status) => {
    const statusColors = {
      Pending: "blue",
      Confirmed: "green",
      Cancelled: "red",
      "In Progress": "amber",
      Completed: "green",
    };
    return statusColors[status] || "gray";
  };

  useEffect(() => {
    if (datas.booking_tomm) {
      setData(datas.booking_tomm);
      setReload(false);
    }
  }, [datas.booking_tomm]);
  useEffect(() => {
    if (reload || data.length === 0) {
      fetchData();
    }
  }, [reload]);

  if (!fullClose) return null;

  return (
    <div>
      <Card className="w-full shadow-lg ">
        <CardHeader
          floated={false}
          className="bg-white shadow-none rounded-none"
        >
          <div className="flex items-center justify-between gap-4 ">
            <div className="flex items-center gap-3">
              <FaCalendarAlt className="text-red-400 text-xl" />
              <Typography
                variant="h5"
                color="blue-gray"
                className="font-medium"
              >
                Tomorrow's Booking Orders
              </Typography>
            </div>

            <div className="flex gap-2">
              <IconButton
                variant="text"
                color="blue-gray"
                size="sm"
                onClick={() => setShowTable(!showTable)}
              >
                <HiMiniMinus className="h-5 w-5" />
              </IconButton>
              <IconButton
                variant="text"
                color="blue-gray"
                size="sm"
                onClick={() => setReload(true)}
              >
                <TfiReload className="h-4 w-4" />
              </IconButton>
              <IconButton
                variant="text"
                color="blue-gray"
                size="sm"
                onClick={() => setFullClose(false)}
              >
                <MdCancel className="h-5 w-5" />
              </IconButton>
            </div>
          </div>
        </CardHeader>

        {showTable && (
          <CardBody className="overflow-x-auto px-0">
            <table className="w-full min-w-max table-auto text-left">
              <thead>
                <tr>
                  {[
                    "ID",
                    "Branch",
                    "Customer",
                    "Mobile",
                    "Booking Date",
                    "Service Date",
                    "Service",
                    "Status",
                  ].map((head) => (
                    <th
                      key={head}
                      className="border-b border-blue-gray-100 bg-blue-gray-50/50 p-4"
                    >
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-medium leading-none"
                      >
                        {head}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="text-center p-4">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-400"></div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  data.map((order, index) => {
                    const isLast = index === data.length - 1;
                    const classes = isLast
                      ? "p-4"
                      : "p-4 border-b border-blue-gray-50";

                    return (
                      <tr
                        key={order.order_ref}
                        className="hover:bg-blue-gray-50/50"
                      >
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {order.order_ref}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <div className="flex items-center gap-2">
                            <FaStore className="text-red-300" />
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {order.branch_name}
                            </Typography>
                          </div>
                        </td>
                        <td className={classes}>
                          <div className="flex items-center gap-2">
                            <FaUser className="text-blue-gray-300" />
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {order.order_customer}
                            </Typography>
                          </div>
                        </td>
                        <td className={classes}>
                          <div className="flex items-center gap-2">
                            <FaPhoneAlt className="text-green-300" />
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {order.order_customer_mobile}
                            </Typography>
                          </div>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {moment(order.order_date).format("DD-MM-YYYY")}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {moment(order.order_service_date).format(
                              "DD-MM-YYYY"
                            )}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {order.order_custom_price <= 1
                              ? order.order_service
                              : order.order_custom}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Chip
                            size="sm"
                            variant="ghost"
                            color={getStatusColor(order.order_status)}
                            value={order.order_status}
                            className="text-center"
                          />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </CardBody>
        )}
      </Card>
    </div>
  );
};

export default BookingOrder;

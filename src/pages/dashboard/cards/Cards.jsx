import { useEffect, useState } from "react";
import {
  FaCalendarAlt,
  FaCalendarDay,
  FaCalendarWeek,
  FaCheckCircle,
  FaHourglassHalf,
} from "react-icons/fa";
import { FiLoader } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const DashboardCard = ({ title, value, icon: Icon, loading, link }) => {
  const navigate = useNavigate();

  return (
    <div
      className="bg-white rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition"
      onClick={() => navigate(link)}
    >
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
            {loading ? (
              <FiLoader className="animate-spin text-lg text-red-600" />
            ) : (
              <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
            )}
          </div>
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-50">
            <Icon className="w-6 h-6 text-red-600" />
          </div>
        </div>
      </div>
    </div>
  );
};
const Cards = ({ datas, loading }) => {
  const [data, setData] = useState({
    booking_pending_count: 0,
    booking_Confirmed_count: 0,
    booking_current_count: 0,
    booking_tomm_count: 0,
  });

  const cardConfig = [
    {
      title: "Pending Bookings",
      value: data.booking_pending_count,
      icon: FaHourglassHalf,
      link: "/pending?page=1",
    },
    {
      title: "Confirmed Bookings",
      value: data.booking_Confirmed_count,
      icon: FaCheckCircle,
      link: "/confirmed?page=1",
    },
    {
      title: "Today's Bookings",
      value: data.booking_current_count,
      icon: FaCalendarDay,
      link: "/today?page=1",
    },
    {
      title: "Tomorrow's Bookings",
      value: data.booking_tomm_count,
      icon: FaCalendarWeek,
      link: "/tomorrow?page=1",
    },
  ];
  useEffect(() => {
    if (datas) {
      const {
        booking_pending_count,
        booking_Confirmed_count,
        booking_current_count,
        booking_tomm_count,
      } = datas;

      setData({
        booking_pending_count,
        booking_Confirmed_count,
        booking_current_count,
        booking_tomm_count,
      });
    }
  }, [datas]);

  return (
    <div>
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
            <FaCalendarAlt className="text-red-600 text-lg" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Dashboard Overview
            </h2>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cardConfig.map((card, index) => (
          <DashboardCard
            key={index}
            title={card.title}
            value={card.value}
            icon={card.icon}
            loading={loading}
            link={card.link}
          />
        ))}
      </div>
    </div>
  );
};

export default Cards;

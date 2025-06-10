import { useEffect, useState } from "react";
import {
  FaCalendarAlt,
  FaCalendarDay,
  FaCalendarWeek,
  FaCheckCircle,
  FaHourglassHalf,
  FaRupeeSign,
} from "react-icons/fa";
import { FiLoader } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const RevenueCard = ({ title, value, icon: Icon, loading, link }) => {
  const navigate = useNavigate();
  return (
    <div
      className="bg-white rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition"
      onClick={() => navigate(link)}
    >
      {" "}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
            {loading ? (
              <FiLoader className={`animate-spin text-lg text-red-600`} />
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

const Revenue = ({ datas, loading, userType }) => {
  const [data, setData] = useState({
    total_year_booking: 0,
    total_year_booking_amount: 0,
    total_month_booking: 0,
    total_month_booking_amount: 0,
    total_current_booking: 0,
    total_current_booking_amount: 0,
  });

  const cardConfig = [
    {
      title: "Total Year Booking",
      value: data?.total_year_booking,
      icon: FaCalendarAlt,
      link: "/all-booking?page=1",
    },
    {
      title: "Total Year Amount",
      value: data?.total_year_booking_amount,
      icon: FaRupeeSign,
      link: "/all-booking?page=1",
    },
    {
      title: "Total Month Booking",
      value: data?.total_month_booking,
      icon: FaCalendarAlt,
      link: "/all-booking?page=1",
    },
    {
      title: "Total Month Amount",
      value: data?.total_month_booking_amount,
      icon: FaRupeeSign,
      link: "/all-booking?page=1",
    },
    {
      title: "Total Today Booking",
      value: data?.total_current_booking,
      icon: FaCalendarAlt,
      link: "/today?page=1",
    },
    {
      title: "Total Today Amount",
      value: data?.total_current_booking_amount,
      icon: FaRupeeSign,
      link: "/today?page=1",
    },
  ];
  useEffect(() => {
    if (datas) {
      const {
        total_year_booking,
        total_year_booking_amount,
        total_month_booking,
        total_month_booking_amount,
        total_current_booking,
        total_current_booking_amount,
      } = datas;

      setData({
        total_year_booking,
        total_year_booking_amount,
        total_month_booking,
        total_month_booking_amount,
        total_current_booking,
        total_current_booking_amount,
      });
    }
  }, [datas]);

  return (
    <div>
      <div className="bg-white rounded-lg shadow-sm p-4 mb-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
            <FaCalendarAlt className="text-red-600 text-lg" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Revenue Overview
            </h2>
          </div>
        </div>
      </div>

      <div
        className={`grid gap-4 mt-4 ${
          userType == 8
            ? "grid-cols-1 md:grid-cols-2"
            : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        }`}
      >
        {" "}
        {cardConfig.map((card, index) => (
          <RevenueCard
            key={index}
            title={card.title}
            value={card.value}
            icon={card.icon}
            link={card.link}
            loading={loading}
          />
        ))}
      </div>
    </div>
  );
};

export default Revenue;

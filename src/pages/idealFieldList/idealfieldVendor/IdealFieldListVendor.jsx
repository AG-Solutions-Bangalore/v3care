import React, { useContext, useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import IdealFieldListFilter from "../../../components/IdealFieldListFilter";
import { FaCalendarAlt } from "react-icons/fa";
import { Card } from "@material-tailwind/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ContextPanel } from "../../../utils/ContextPanel";
import BASE_URL from "../../../base/BaseUrl";
import UseEscapeKey from "../../../utils/UseEscapeKey";
const IdealFieldListVendor = () => {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  var todayback = yyyy + "-" + mm + "-" + dd;
  UseEscapeKey();
  const [idealData, setIdealData] = useState([]);

  const [idealDataDate, setIdealDataDate] = useState({
    from_date: todayback,
  });
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
  const navigate = useNavigate();

  const onInputChange = (e) => {
    setIdealDataDate({
      ...idealDataDate,
      [e.target.name]: e.target.value,
    });
  };
  useEffect(() => {
    const fetchIdealData = async () => {
      try {
        if (!isPanelUp) {
          navigate("/maintenance");
          return;
        }
        setLoading(true);
        let data = {
          from_date: idealDataDate.from_date,
        };
        const token = localStorage.getItem("token");
        const response = await axios.post(
          `${BASE_URL}/api/panel-fetch-vendor-ideal-field`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const sortedData = response.data?.stock.sort((a, b) =>
          a.branch_name.localeCompare(b.branch_name)
        );
  
        setIdealData(sortedData);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchIdealData();
    setLoading(false);
  }, [idealDataDate.from_date]);
  return (
    <Layout>
      <IdealFieldListFilter />
      <div className="container mx-auto px-4">
        {/* Page Title */}
        {/* <div className="my-3 bg-white rounded-lg p-2 text-2xl font-bold text-gray-800">
          Vendor Ideal Field List
        </div> */}

        <Card className=" mt-2 p-2">
          <form id="addIndiv" autoComplete="off">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
              
                <input
                  type="date"
                  name="from_date"
                  value={idealDataDate.from_date}
                  onChange={onInputChange}
                  className="mt-2 w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
            </div>
          </form>
        </Card>

        <div className="grid grid-cols-2 md:grid-cols-4 bg-white rounded-lg p-1 lg:grid-cols-6 gap-4 mt-4">
          {idealData.map((data, key) => (
            <div key={key} className="flex justify-center">
              <div
                className={`social-card w-full p-2 text-center rounded-md shadow-md ${
                  data.o_id === "0"
                    ? "bg-gray-200 text-gray-800"
                    : "bg-green-200 text-green-800"
                }`}
              >
                <div className="text-sm font-semibold">{data.name.split(' ')[0]}</div>
                <div className="text-xs">{data.branch_name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default IdealFieldListVendor;

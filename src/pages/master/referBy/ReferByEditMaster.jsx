import React, { useContext, useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import MasterFilter from "../../../components/MasterFilter";
import { useNavigate, useParams } from "react-router-dom";
import { FaBuilding } from "react-icons/fa";
import { Button, Card } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import { ContextPanel } from "../../../utils/ContextPanel";
import { toast } from "react-toastify";

const ReferByEditMaster = () => {
  const [referBy, setReferBy] = useState({
    refer_by: "",
    refer_by_status: "",
  });

  const [status, setStatus] = useState([
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
  ]);
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
  const navigate = useNavigate();

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const onInputChange = (e) => {
    setReferBy({
      ...referBy,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    const fetchReferByData = async () => {
      try {
        if (!isPanelUp) {
          navigate("/maintenance");
          return;
        }
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-referby-by-id/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setReferBy(response.data?.referby);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReferByData();
    setLoading(false);
  }, [id]);

  const onSubmit = async (e) => {
    e.preventDefault();
    let data = {
      refer_by: referBy.refer_by,
      refer_by_status: referBy.refer_by_status,
    };

    setIsButtonDisabled(true);

    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        `${BASE_URL}/api/panel-update-referby/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Update successful");
      navigate("/refer-by");
    } catch (error) {
      console.error("Error updating refer by", error);
      toast.error("Update failed. Please try again.");
    } finally {
      setIsButtonDisabled(false);
    }
  };
  return (
    <Layout>
      <MasterFilter />
      <div className="container mx-auto px-4">
        {/* Page Title */}
        <div className="my-4 text-2xl font-bold text-gray-800">
          <FaBuilding className="inline mr-2" /> Edit Refer By
        </div>

        <Card className="p-6 mt-6">
          <form id="addIndiv" autoComplete="off" onSubmit={onSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Branch Name */}
              <div className="form-group">
                <label htmlFor="refer_by" className="text-gray-700">
                  Refer By<span className="text-red-800">*</span>
                </label>
                <input
                  type="text"
                  name="refer_by"
                  value={referBy.refer_by}
                  onChange={onInputChange}
                  disabled
                  className="w-full border border-gray-300 rounded-md p-2 mt-2 focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              {/* Branch Status */}
              <div className="form-group">
                <label htmlFor="refer_by_status" className="text-gray-700">
                  Status<span className="text-red-800">*</span>
                </label>
                <select
                  name="refer_by_status"
                  value={referBy.refer_by_status}
                  onChange={onInputChange}
                  className="w-full border border-gray-300 rounded-md p-2 mt-2 focus:ring-2 focus:ring-blue-400"
                  required
                >
                  <option value="">Select Status</option>
                  {status.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Buttons */}
            <div className="text-center mt-6">
              <Button
                type="submit"
                className="mr-4 mb-4"
                color="blue"
                disabled={isButtonDisabled}
              >
                {isButtonDisabled ? "Updating..." : "Update"}
              </Button>
              <Link to="/refer-by">
                <Button className="mr-4 mb-4" color="green">
                  Back
                </Button>
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default ReferByEditMaster;

import React, { useContext, useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import MasterFilter from "../../../components/MasterFilter";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ContextPanel } from "../../../utils/ContextPanel";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import {
  FaUser,
  FaMobile,
  FaEnvelope,
  FaIdCard,
  FaCreditCard,
  FaComments,
  FaEdit,
  FaArrowLeft,
} from "react-icons/fa";

const OperationViewTeamMaster = () => {
  const { id } = useParams();
  const [fieldTeamViewData, setFieldTeamViewData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOpTeamData = async () => {
      try {
        if (!isPanelUp) {
          navigate("/maintenance");
          return;
        }
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-admin-user-by-id/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setFieldTeamViewData(response.data?.adminUser);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOpTeamData();
    setLoading(false);
  }, []);

  const InfoCard = ({ icon, label, value }) => (
    <div className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4">
      <div className="text-blue-500 text-2xl">{icon}</div>
      <div>
        <h3 className="text-sm font-semibold text-gray-500">{label}</h3>
        <p className="text-lg font-medium text-gray-900">{value || "N/A"}</p>
      </div>
    </div>
  );

  return (
    <Layout>
      <MasterFilter />
      <div className="w-full mx-auto p-6 bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row justify-between">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                View Operation Team{id}
              </h1>
              <div className="flex flex-row  gap-2">
                <a
                  target="_blank"
                  className="px-2  bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out flex items-center"
                  href={
                    "https://agsdraft.online/app/storage/app/public/user_document/" +
                    fieldTeamViewData?.user_aadhar
                  }
                >
                  Download Aadhar
                </a>
                <Link
                  className="px-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-150 ease-in-out flex items-center"
                  to={"/"}
                >
                  Download Pan Card
                </Link>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading data...</p>
              </div>
            ) : fieldTeamViewData ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-5 gap-6">
                <InfoCard
                  icon={<FaUser />}
                  label="Name"
                  value={fieldTeamViewData?.name}
                />
                <InfoCard
                  icon={<FaMobile />}
                  label="Mobile"
                  value={fieldTeamViewData?.mobile}
                />
                <InfoCard
                  icon={<FaEnvelope />}
                  label="Email"
                  value={fieldTeamViewData?.email}
                />
                <InfoCard
                  icon={<FaIdCard />}
                  label="Aadhar"
                  value={fieldTeamViewData?.user_aadhar_no}
                />
                <InfoCard
                  icon={<FaCreditCard />}
                  label="PAN"
                  value={fieldTeamViewData?.user_pancard_no}
                />
                <InfoCard
                  icon={<FaComments />}
                  label="Remarks"
                  value={fieldTeamViewData?.remarks || "No remarks available"}
                />
              </div>
            ) : (
              <p className="text-center text-gray-600">No data available</p>
            )}

            <div className="flex justify-end space-x-4 mt-8">
              <button
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out flex items-center"
                onClick={() => navigate("/operation-team-edit/" + id)}
              >
                <FaEdit className="mr-2" />
                Edit
              </button>
              <button
                className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition duration-150 ease-in-out flex items-center"
                onClick={() => navigate("/operation-team")}
              >
                <FaArrowLeft className="mr-2" />
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OperationViewTeamMaster;

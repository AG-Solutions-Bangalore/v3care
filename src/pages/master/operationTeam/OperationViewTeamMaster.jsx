import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { FaFileDownload } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../base/BaseUrl";
import ButtonConfigColor from "../../../components/common/ButtonConfig/ButtonConfigColor";
import { ContextPanel } from "../../../utils/ContextPanel";
import UseEscapeKey from "../../../utils/UseEscapeKey";

const OperationViewTeamMaster = ({ operationId, onClose }) => {
  const [fieldTeamViewData, setFieldTeamViewData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isPanelUp, userType } = useContext(ContextPanel);
  const navigate = useNavigate();
  UseEscapeKey();
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
          `${BASE_URL}/api/panel-fetch-admin-user-by-id/${operationId}`,
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
  }, [operationId]);

  const DetailRow = ({ label, value }) => (
    <div className="flex border-b border-gray-100 py-3">
      <div className="w-1/3 text-gray-600 font-medium">{label}</div>
      <div className="w-2/3 text-black font-medium">{value || "N/A"}</div>
    </div>
  );

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm max-w-3xl mx-auto">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-xl font-bold text-black">
                Office Staff Details
              </h1>

              <div className="flex gap-2">
                <button
                  onClick={() =>
                    window.open(
                      `${USER_DOCUMENT}/` + fieldTeamViewData?.user_aadhar,
                      "_blank"
                    )
                  }
                  className="px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100 font-medium"
                >
                  <div className="flex items-center">
                    <FaFileDownload className="mr-1" />
                    Aadhar
                  </div>
                </button>

                <button
                  onClick={() =>
                    window.open(
                      `${USER_DOCUMENT}/` + fieldTeamViewData?.user_pancard,
                      "_blank"
                    )
                  }
                  className="px-3 py-1.5 text-sm bg-red-50 text-red-700 rounded hover:bg-red-100 font-medium"
                >
                  <div className="flex items-center">
                    <FaFileDownload className="mr-1" />
                    PAN
                  </div>
                </button>
              </div>
            </div>

            {fieldTeamViewData ? (
              <div className="space-y-1">
                <DetailRow label="Name" value={fieldTeamViewData?.name} />
                <DetailRow label="Mobile" value={fieldTeamViewData?.mobile} />
                <DetailRow label="Email" value={fieldTeamViewData?.email} />
                <DetailRow
                  label="Aadhar Number"
                  value={fieldTeamViewData?.user_aadhar_no}
                />
                <DetailRow
                  label="PAN Number"
                  value={fieldTeamViewData?.user_pancard_no}
                />
                <DetailRow
                  label="Remarks"
                  value={fieldTeamViewData?.remarks || "No remarks available"}
                />
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No data available</p>
              </div>
            )}

            <div className="flex justify-center space-x-4 my-2">
              {userType !== "4" && (
                <ButtonConfigColor
                  type="edit"
                  buttontype="submit"
                  label="Update"
                  onClick={() =>
                    navigate("/operation-team-edit/" + operationId)
                  }
                />
              )}

              <ButtonConfigColor
                type="back"
                buttontype="button"
                label="Cancel"
                onClick={onClose}
              />
            </div>
          </div>
          // </div>
        )}
      </div>
    </>
  );
};

export default OperationViewTeamMaster;

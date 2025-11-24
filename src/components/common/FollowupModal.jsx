import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@material-tailwind/react";
import { BASE_URL } from "../../base/BaseUrl";
import { toast } from "react-toastify";

const FollowupModal = ({ open, handleOpen, orderRef }) => {
  const [followData, setFollowData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !orderRef) return;

    const fetchFollowUp = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `${BASE_URL}/api/panel-get-booking-followup?order_ref=${orderRef}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const followups = response?.data?.bookingFollowup;

        // If data exists, assign, else close modal
        if (Array.isArray(followups) && followups.length > 0) {
          setFollowData(followups);
        } else {
          toast.warning("No follow-up data found");
          handleOpen(false); // Close modal immediately
        }
      } catch (error) {
        console.error("Error fetching followup", error);
        toast.error("Failed to fetch follow up data");
        handleOpen(false);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowUp();
  }, [open, orderRef]);

  return (
    <Dialog open={open} handler={handleOpen} size="lg">
      <DialogHeader>Follow Up Details</DialogHeader>

      <DialogBody>
        {loading ? (
          <p className="text-center font-semibold">Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-blue-200">
                  <th className="border border-black px-4 py-2 text-left">
                    Date
                  </th>
                  <th className="border border-black px-4 py-2 text-left">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                {followData.map((item, index) => (
                  <tr key={index}>
                    <td className="border border-black px-4 py-2">
                      {moment(item.order_followup_date).format("DD-MM-YYYY")}
                    </td>
                    <td className="border border-black px-4 py-2">
                      {item.order_followup_description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DialogBody>

      <DialogFooter>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => handleOpen(false)}
        >
          Close
        </button>
      </DialogFooter>
    </Dialog>
  );
};

export default FollowupModal;

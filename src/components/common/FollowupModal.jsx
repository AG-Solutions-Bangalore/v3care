import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@material-tailwind/react";
import moment from "moment";

const FollowupModal = ({ open, handleOpen, followData }) => {
  // const [followData, setFollowData] = useState([]);
  // const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   if (!open || !orderRef) return;

  //   const fetchFollowUp = async () => {
  //     try {
  //       setLoading(true);
  //       const token = localStorage.getItem("token");

  //       const response = await axios.get(
  //         `${BASE_URL}/api/panel-get-booking-followup?order_ref=${orderRef}`,
  //         {
  //           headers: { Authorization: `Bearer ${token}` },
  //         }
  //       );

  //       const followups = response?.data?.bookingFollowup;

  //       if (Array.isArray(followups) && followups.length > 0) {
  //         setFollowData(followups);
  //       } else {
  //         toast.warning("No follow-up data found");
  //         handleOpen(false);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching followup", error);
  //       toast.error("Failed to fetch follow up data");
  //       handleOpen(false);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchFollowUp();
  // }, [open, orderRef]);

  return (
    <>
      {followData?.length > 0 && (
        <Dialog open={open} handler={handleOpen} size="lg">
          <DialogHeader>Follow Up Details</DialogHeader>

          <DialogBody>
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
                    <th className="border border-black px-4 py-2 text-left">
                      Created By
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
                      <td className="border border-black px-4 py-2">
                        {item.created_by}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
      )}
    </>
  );
};

export default FollowupModal;

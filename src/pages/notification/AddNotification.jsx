import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { MdTitle, MdDescription, MdImage } from "react-icons/md";
import { Button } from "@mui/material";
import Layout from "../../layout/Layout";
import axios from "axios";
import BASE_URL from "../../base/BaseUrl";
import { toast } from "react-toastify";
import UseEscapeKey from "../../utils/UseEscapeKey";

const AddNotification = () => {
  const [notification, setNotification] = useState({
    notification_heading: "",
    notification_image: "",
    notification_sub_heading: "",
  });
  UseEscapeKey();
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const onInputChange = (e) => {
    setNotification({ ...notification, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("notification_heading", notification.notification_heading);
    data.append(
      "notification_sub_heading",
      notification.notification_sub_heading
    );
    data.append("notification_image", selectedFile);

    var v = document.getElementById("addIndiv").checkValidity();
    var v = document.getElementById("addIndiv").reportValidity();
    e.preventDefault();

    if (v) {
      setIsButtonDisabled(true);

      // const response = await axios.post(
      //   `${BASE_URL}/api/panel-create-notification`,
      //   data,
      //   {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //     },
      //   }
      // );
      // if (response.data.code == "200") {
      //   alert("success");
      // } else {
      //   alert("duplicate entry");
      // }

      axios({
        url: BASE_URL + "/api/panel-create-notification",
        method: "POST",
        data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }).then((res) => {
        if (res.data.code == "200") {
          toast.success("Notification Created");
          navigate("/notification");
        } else {
          toast.error("Duplicate Entry");
        }
      });
    }
    setIsButtonDisabled(true);
  };

  // useEffect(() => {
  //   const fetchTodayData = async () => {
  //     try {
  //       if (!isPanelUp) {
  //         navigate("/maintenance");
  //         return;
  //       }
  //       setLoading(true);
  //       const token = localStorage.getItem("token");
  //       const response = await axios.get(
  //         `${BASE_URL}/api/panel-fetch-booking-today-list`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );

  //       setTodayBookingData(response.data?.booking);
  //     } catch (error) {
  //       console.error("Error fetching dashboard data", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchTodayData();
  //   setLoading(false);
  // }, []);
  return (
    <Layout>
      <div className="w-full mx-auto p-6">
        <div className="flex flex-col mb-6 md:flex-row justify-between items-center bg-white mt-5 p-2 rounded-lg space-y-4 md:space-y-0">
          <h3 className="text-center md:text-left text-lg md:text-xl font-bold">
            Create Notification
          </h3>
        </div>
        <div className="bg-white p-4 rounded-lg">
          <form id="addIndiv" autoComplete="off" className="space-y-6">
            {/* Heading Input */}
            <div>
              <label className="block text-gray-700 mb-2">
                Heading <span className="text-red-700">*</span>
              </label>
              <div className="relative">
                <MdTitle className="absolute top-3 left-3 text-blue-400" />
                <input
                  type="text"
                  name="notification_heading"
                  value={notification.notification_heading}
                  onChange={onInputChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-700 rounded-md  "
                  required
                />
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-gray-700 mb-2">Image</label>
              <div className="relative">
                <MdImage className="absolute top-3 left-3 text-red-400" />
                <input
                  type="file"
                  name="notification_image"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="w-full pl-10 pr-4 py-2 border border-gray-700 rounded-md "
                />
              </div>
            </div>

            {/* Description Input */}
            <div>
              <label className="block text-gray-700 mb-2">
                Description <span className="text-red-700">*</span>
              </label>
              <div className="relative">
                <MdDescription className="absolute top-3 left-3 text-green-400" />
                <textarea
                  name="notification_sub_heading"
                  value={notification.notification_sub_heading}
                  onChange={onInputChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-700 rounded-md "
                  rows="4"
                  required
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-center space-x-4">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                onClick={onSubmit}
                // disabled={isButtonDisabled}
              >
                Submit
              </Button>
              <Link to="/notification">
                <Button variant="contained" color="success">
                  <FaArrowLeft className="inline mr-2" /> Back
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AddNotification;

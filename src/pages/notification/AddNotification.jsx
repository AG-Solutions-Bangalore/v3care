import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { MdTitle, MdDescription, MdImage } from "react-icons/md";
import { Button } from "@mui/material";
import Layout from "../../layout/Layout";
import axios from "axios";
import {BASE_URL} from "../../base/BaseUrl";
import { toast } from "react-toastify";
import UseEscapeKey from "../../utils/UseEscapeKey";
import PageHeader from "../../components/common/PageHeader/PageHeader";
import ButtonConfigColor from "../../components/common/ButtonConfig/ButtonConfigColor";

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
  const [loading, setLoading] = useState(false);

  const onInputChange = (e) => {
    setNotification({ ...notification, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    const data = new FormData();
    data.append("notification_heading", notification.notification_heading);
    data.append(
      "notification_sub_heading",
      notification.notification_sub_heading
    );
    data.append("notification_image", selectedFile);

    const form = document.getElementById("addIndiv");
    const isValid = form.checkValidity();

    if (!isValid) {
      form.reportValidity();
      setLoading(false);
      return;
    }

    setIsButtonDisabled(true);

    try {
      const res = await axios.post(
        `${BASE_URL}/api/panel-create-notification`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.code == "200") {
        toast.success(res.data?.msg || "Notification Created");
        navigate("/notification");
      } else {
        toast.error(res.data?.msg || "Duplicate Entry");
      }
    } catch (error) {
      console.error("Error creating notification:", error);
      toast.error("Error creating notification");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <PageHeader title={"Create Notification"} />

      <div className="bg-white p-4 rounded-lg mt-2">
        <form
          id="addIndiv"
          autoComplete="off"
          className="space-y-6"
          onSubmit={onSubmit}
        >
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

          <div className="flex justify-center space-x-4">
            <ButtonConfigColor
              type="submit"
              buttontype="submit"
              label="Submit"
              disabled={isButtonDisabled}
              loading={loading}
            />

            <ButtonConfigColor
              type="back"
              buttontype="button"
              label="Cancel"
              onClick={() => navigate(-1)}
            />
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AddNotification;

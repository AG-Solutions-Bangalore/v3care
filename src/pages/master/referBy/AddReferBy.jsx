import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdSend, MdArrowBack } from "react-icons/md";
import Layout from "../../../layout/Layout";
import MasterFilter from "../../../components/MasterFilter";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import { toast } from "react-toastify";

const AddReferBy = () => {
  const [referby, setReferBy] = useState({
    refer_by: "",
  });
  const navigate = useNavigate();

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const onInputChange = (e) => {
    setReferBy({
      ...referby,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsButtonDisabled(true);
    let data = {
      refer_by: referby.refer_by,
    };
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${BASE_URL}/api/panel-create-referby`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.data.code == "200") {
      toast.success("ReferBy Create succesfull");

      setReferBy({
        refer_by: "",
      });
      navigate("/refer-by");
    } else {
      toast.error("duplicate entry");
    }
    setIsButtonDisabled(false);
  };

  return (
    <Layout>
      <MasterFilter />
      <div className="flex flex-col md:flex-row justify-between items-center bg-white mt-5 p-2 rounded-lg space-y-4 md:space-y-0">
        <h3 className="text-center md:text-left text-lg md:text-xl font-bold">
          Create Refer By
        </h3>
      </div>
      <div className="w-full mx-auto mt-2 p-4 bg-white shadow-md rounded-lg">
        {/* Page Title */}

        <form id="addIndiv" autoComplete="off" onSubmit={onSubmit}>
          <div className="grid grid-cols-1 gap-6 mb-6">
            {/* Branch Name Field */}
            <div className="form-group">
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                Refer By <span className="text-red-700">*</span>
              </label>
              <input
                type="text"
                name="refer_by"
                value={referby.refer_by}
                onChange={onInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-center space-x-4">
            {/* Submit Button */}
            <button
              type="submit"
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-md shadow-lg hover:from-blue-600 hover:to-indigo-600 focus:ring-4 focus:ring-blue-300 disabled:opacity-50 transition-all duration-300"
              disabled={isButtonDisabled}
            >
              <MdSend className="w-5 h-5" />
              <span>{isButtonDisabled ? "Submiting..." : "Sumbit"}</span>
            </button>

            {/* Back Button */}
            <Link to="/refer-by">
              <button
                type="button"
                className="flex items-center space-x-2 bg-green-500 text-white px-6 py-3 rounded-md shadow-lg hover:bg-green-600 focus:ring-4 focus:ring-green-300 transition-all duration-300"
              >
                <MdArrowBack className="w-5 h-5" />
                <span>Back</span>
              </button>
            </Link>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AddReferBy;

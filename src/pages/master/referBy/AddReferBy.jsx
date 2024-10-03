import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdSend, MdArrowBack } from "react-icons/md";
import Layout from "../../../layout/Layout";
import MasterFilter from "../../../components/MasterFilter";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import { toast } from "react-toastify";
import { Button, Input } from "@material-tailwind/react";
import UseEscapeKey from "../../../utils/UseEscapeKey";

const AddReferBy = () => {
  const [referby, setReferBy] = useState({
    refer_by: "",
  });
  const navigate = useNavigate();
  UseEscapeKey();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const onInputChange = (e) => {
    setReferBy({
      ...referby,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    var form = document.getElementById("addIndiv").checkValidity();
    if (!form) {
      toast.error("Fill all required field");
      return;
    }
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
              <Input
                fullWidth
                label="Refer By"
                required
                name="refer_by"
                value={referby.refer_by}
                onChange={onInputChange}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-center space-x-4">
            {/* Submit Button */}

            <Button
              type="submit"
              className="mr-2 mb-2"
              color="primary"
              disabled={isButtonDisabled}
            >
              <div className="flex gap-1">
                <MdSend className="w-4 h-4" />
                <span>{isButtonDisabled ? "Submiting..." : "Sumbit"}</span>
              </div>
            </Button>

            {/* Back Button */}
            <Link to="/refer-by">
              <Button className="mr-2 mb-2" color="primary">
                <div className="flex gap-1">
                  <MdArrowBack className="w-4 h-4" />
                  <span> Back</span>
                </div>
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AddReferBy;

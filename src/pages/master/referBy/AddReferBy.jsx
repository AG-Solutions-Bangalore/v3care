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
import ButtonConfigColor from "../../../components/common/ButtonConfig/ButtonConfigColor";
import PageHeader from "../../../components/common/PageHeader/PageHeader";

const AddReferBy = () => {
  const [referby, setReferBy] = useState({
    refer_by: "",
  });
  const navigate = useNavigate();
  UseEscapeKey();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const onInputChange = (e) => {
    setReferBy({
      ...referby,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Ensure form is valid
    const form = document.getElementById("addIndiv");
    if (!form || !form.checkValidity()) {
      toast.error("Fill all required fields");
      setLoading(false);
      return;
    }

    setIsButtonDisabled(true);

    try {
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

      if (response.data.code === "200") {
        toast.success("ReferBy Created Successfully");
        setReferBy({ refer_by: "" });
        navigate("/refer-by");
      } else {
        toast.error("Duplicate entry");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error("Error:", error);
    }

    setIsButtonDisabled(false);
    setLoading(false);
  };

  return (
    <Layout>
      <MasterFilter />
      {/* <div className="flex flex-col md:flex-row justify-between items-center  mt-5 p-2  space-y-4 md:space-y-0">
        <h3 className="text-center md:text-left text-lg md:text-xl font-bold">
          Create Refer By
        </h3>
      </div> */}
      <PageHeader title={"Create Refer By"} />
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
              onClick={() => navigate("/refer-by")}
            />
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AddReferBy;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdSend, MdArrowBack } from "react-icons/md";
import Layout from "../../../layout/Layout";
import MasterFilter from "../../../components/MasterFilter";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import { toast } from "react-toastify";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Input,
  Option,
  Button,
  Select,
} from "@material-tailwind/react";
import UseEscapeKey from "../../../utils/UseEscapeKey";
import PageHeader from "../../../components/common/PageHeader/PageHeader";
import ButtonConfigColor from "../../../components/common/ButtonConfig/ButtonConfigColor";

const AddBranch = () => {
  const [branch, setBranch] = useState({
    branch_name: "",
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  UseEscapeKey();
  const onInputChange = (e) => {
    setBranch({
      ...branch,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // Start Loading
    setLoading(true);
    setIsButtonDisabled(true);

    var form = document.getElementById("addIndiv").checkValidity();
    if (!form) {
      toast.error("Fill all required fields");
      setLoading(false);
      setIsButtonDisabled(false);
      return;
    }

    let data = {
      branch_name: branch.branch_name,
    };

    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        `${BASE_URL}/api/panel-create-branch`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.code === "200") {
        toast.success("Branch Created Successfully");

        setBranch({ branch_name: "" });

        navigate("/branch");
      } else {
        toast.error("Duplicate entry");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }

    // Stop Loading
    setLoading(false);
    setIsButtonDisabled(false);
  };

  return (
    <Layout>
      <MasterFilter />

      <PageHeader title={"Create Branch"} />

      <div className="w-full mx-auto mt-2 p-4 bg-white shadow-md rounded-lg">
        <form id="addIndiv" autoComplete="off" onSubmit={onSubmit}>
          <div className="grid grid-cols-1 gap-6 mb-6">
            {/* Branch Name Field */}

            <div className="form-group">
              <Input
                fullWidth
                label="Branch Name"
                required
                multiline
                name="branch_name"
                value={branch.branch_name}
                onChange={onInputChange}
              />
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <ButtonConfigColor
              type="submit"
              buttontype="submit"
              label="Create"
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
          {/* //edit  */}
        </form>
      </div>
    </Layout>
  );
};

export default AddBranch;

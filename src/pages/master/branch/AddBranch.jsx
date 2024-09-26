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

const AddBranch = () => {
  const [branch, setBranch] = useState({
    branch_name: "",
  });
  const navigate = useNavigate();

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const onInputChange = (e) => {
    setBranch({
      ...branch,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsButtonDisabled(true);
    let data = {
      branch_name: branch.branch_name,
    };
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${BASE_URL}/api/panel-create-branch`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.data.code == "200") {
      toast.success("Branch Create succesfull");

      setBranch({
        branch_name: "",
      });
      navigate("/branch");
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
          Create Branch
        </h3>
      </div>
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
          <div className="col-span-2"></div>

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
                <span>{isButtonDisabled ? "Creating..." : "Create"}</span>
              </div>
            </Button>

            {/* Back Button */}
            <Link to="/branch">
              <Button className="mr-2 mb-2" color="primary">
                Back
              </Button>
            </Link>
          </div>

          {/* //edit  */}
        </form>
      </div>
    </Layout>
  );
};

export default AddBranch;

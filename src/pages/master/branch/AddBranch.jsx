import { Input } from "@material-tailwind/react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BASE_URL } from "../../../base/BaseUrl";
import ButtonConfigColor from "../../../components/common/ButtonConfig/ButtonConfigColor";
import PageHeader from "../../../components/common/PageHeader/PageHeader";
import MasterFilter from "../../../components/MasterFilter";
import Layout from "../../../layout/Layout";
import UseEscapeKey from "../../../utils/UseEscapeKey";

const AddBranch = () => {
  const [branch, setBranch] = useState({
    branch_name: "",
    branch_pincode: "",
    branch_state_name: "",
    branch_contact_person: "",
    branch_contact_no: "",
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  UseEscapeKey();
  // const onInputChange = (e) => {
  //   setBranch({
  //     ...branch,
  //     [e.target.name]: e.target.value,
  //   });
  // };
  const onInputChange = (e) => {
    const { name, value } = e.target;

    let newValue = value;
    if (name === "branch_pincode" || name === "branch_contact_no") {
      newValue = value.replace(/\D/g, "");
    }

    setBranch({
      ...branch,
      [name]: newValue,
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
      branch_pincode: branch.branch_pincode,
      branch_state_name: branch.branch_state_name,
      branch_contact_person: branch.branch_contact_person,
      branch_contact_no: branch.branch_contact_no,
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

      if (response.data.code == "200") {
        toast.success(response.data?.msg || "Branch Created Successfully");

        setBranch({ branch_name: "" });

        navigate("/branch");
      } else {
        toast.error(response.data?.msg || "Duplicate entry");
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {/* Branch Name Field */}
            <Input
              fullWidth
              label="Branch Name"
              required
              name="branch_name"
              maxLength={80}
              value={branch.branch_name}
              onChange={onInputChange}
            />
            <Input
              fullWidth
              label="Pincode"
              name="branch_pincode"
              maxLength={6}
              value={branch.branch_pincode}
              onChange={onInputChange}
            />
            <Input
              fullWidth
              label="State Name"
              name="branch_state_name"
              maxLength={80}
              value={branch.branch_state_name}
              onChange={onInputChange}
            />
            <Input
              fullWidth
              label="Contact Person"
              name="branch_contact_person"
              maxLength={80}
              value={branch.branch_contact_person}
              onChange={onInputChange}
            />
            <Input
              fullWidth
              label="Contact No"
              name="branch_contact_no"
              maxLength={10}
              value={branch.branch_contact_no}
              onChange={onInputChange}
            />
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

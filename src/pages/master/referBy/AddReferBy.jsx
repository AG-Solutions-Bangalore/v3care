import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdSend, MdArrowBack } from "react-icons/md";
import Layout from "../../../layout/Layout";
import MasterFilter from "../../../components/MasterFilter";
import axios from "axios";
import { BASE_URL } from "../../../base/BaseUrl";
import { toast } from "react-toastify";
import { Button, Input } from "@material-tailwind/react";
import UseEscapeKey from "../../../utils/UseEscapeKey";
import ButtonConfigColor from "../../../components/common/ButtonConfig/ButtonConfigColor";
import PageHeader from "../../../components/common/PageHeader/PageHeader";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const AddReferBy = () => {
  const [referby, setReferBy] = useState({
    refer_by: "",
    branch_id: "",
    refer_by_contact_no: "",
  });
  const navigate = useNavigate();
  UseEscapeKey();
  const [branch, setBranch] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  // const onInputChange = (e) => {
  //   setReferBy({
  //     ...referby,
  //     [e.target.name]: e.target.value,
  //   });
  // };
  const onInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "refer_by_contact_no") {
      const cleanedValue = value.replace(/\D/g, "").slice(0, 10);
      setReferBy({
        ...referby,
        [name]: cleanedValue,
      });
    } else {
      setReferBy({
        ...referby,
        [name]: value,
      });
    }
  };

  useEffect(() => {
    const fetchBranchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BASE_URL}/api/panel-fetch-branch`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setBranch(response.data?.branch);
      } catch (error) {
        console.error("Error fetching branch data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBranchData();
  }, []);
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

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
        branch_id: referby.branch_id,
        refer_by_contact_no: referby.refer_by_contact_no,
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
        toast.success(response.data?.msg || "ReferBy Created Successfully");
        setReferBy({ refer_by: "", branch_id: "" });
        navigate("/refer-by");
      } else {
        toast.error(response.data?.msg || "Duplicate entry");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error("Error:", error);
      setLoading(false);
    }
    setIsButtonDisabled(false);
    setLoading(false);
  };

  return (
    <Layout>
      <MasterFilter />

      <PageHeader title={"Create Referred By"} />
      <div className="w-full mx-auto mt-2 p-4 bg-white shadow-md rounded-lg">
        <form id="addIndiv" autoComplete="off" onSubmit={onSubmit}>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-6">
            <div className="form-group">
              <Input
                label="Referred By"
                required
                name="refer_by"
                maxLength={80}
                value={referby.refer_by}
                onChange={onInputChange}
              />
            </div>
            <FormControl>
              <InputLabel id="service-select-label">
                <span className="text-sm relative bottom-[6px]">
                  Branch Name
                  <span className="text-red-700">*</span>
                </span>
              </InputLabel>
              <Select
                sx={{ height: "40px", borderRadius: "5px" }}
                labelId="service-select-label"
                id="service-select"
                name="branch_id"
                value={referby.branch_id}
                onChange={onInputChange}
                label="Branch Id *"
                required
              >
                {branch.map((item) => (
                  <MenuItem key={item.id} value={String(item.id)}>
                    {item.branch_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>{" "}
            <Input
              label="Referred Mobile"
              name="refer_by_contact_no"
              value={referby.refer_by_contact_no}
              onChange={onInputChange}
            />
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

export default AddReferBy;

import { Input } from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BASE_URL } from "../../../base/BaseUrl";
import ButtonConfigColor from "../../../components/common/ButtonConfig/ButtonConfigColor";
import PageHeader from "../../../components/common/PageHeader/PageHeader";
import MasterFilter from "../../../components/MasterFilter";
import Layout from "../../../layout/Layout";
import UseEscapeKey from "../../../utils/UseEscapeKey";

const CreateHoliday = () => {
  const [holiday, seHoliday] = useState({
    holiday_date: "",
  });
  const navigate = useNavigate();
  UseEscapeKey();
  const [branch, setBranch] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const onInputChange = (e) => {
    seHoliday({
      ...holiday,
      [e.target.name]: e.target.value,
    });
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
        holiday_date: holiday.holiday_date,
      };

      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${BASE_URL}/api/panel-create-holiday`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.code == "200") {
        toast.success(response.data?.msg || "Holiday Created Successfully");
        seHoliday({ holiday_date: "" });
        navigate("/holiday-list");
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

      <PageHeader title={"Create Holiday"} />
      <div className="w-full mx-auto mt-2 p-4 bg-white shadow-md rounded-lg">
        <form id="addIndiv" autoComplete="off" onSubmit={onSubmit}>
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="form-group">
              <Input
                label="Holiday Date"
                required
                type="date"
                name="holiday_date"
                value={holiday.holiday_date}
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
              onClick={() => navigate(-1)}
            />
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CreateHoliday;

import { Card, Input } from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { BASE_URL } from "../../../base/BaseUrl";
import ButtonConfigColor from "../../../components/common/ButtonConfig/ButtonConfigColor";
import LoaderComponent from "../../../components/common/LoaderComponent";
import PageHeader from "../../../components/common/PageHeader/PageHeader";
import MasterFilter from "../../../components/MasterFilter";
import Layout from "../../../layout/Layout";
import UseEscapeKey from "../../../utils/UseEscapeKey";

const EditHoliday = () => {
  const [holiday, setHoliday] = useState({
    holiday_date: "",
    holiday_name: "",
  });

  UseEscapeKey();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetchloading, setFetchLoading] = useState(false);
  const navigate = useNavigate();
  const storedPageNo = localStorage.getItem("page-no");
  const pageNo =
    storedPageNo === "null" || storedPageNo === null ? "1" : storedPageNo;
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const onInputChange = (e) => {
    setHoliday({
      ...holiday,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    const fetchHolidayByData = async () => {
      setFetchLoading(true);

      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-holiday-by-id/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setHoliday(response.data?.holiday);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setFetchLoading(false);
      }
    };
    fetchHolidayByData();
  }, [id]);
  const handleBack = (e) => {
    e.preventDefault();
    navigate(`/holiday-list?page=${pageNo}`);
  };
  const onSubmit = async (e) => {
    setLoading(true);

    e.preventDefault();
    let data = {
      holiday_date: holiday.holiday_date,
      holiday_name: holiday.holiday_name,
    };

    setIsButtonDisabled(true);

    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        `${BASE_URL}/api/panel-update-holiday/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data?.code === 200) {
        toast.success(response.data?.msg || "Update successful");
        navigate(`/holiday-list?page=${pageNo}`);
      } else {
        toast.error(response.data?.msg || "Update failed");
      }
    } catch (error) {
      console.error("Error updating holiday by", error);
      toast.error("Update failed. Please try again.");
      setLoading(false);
      setIsButtonDisabled(false);
    } finally {
      setIsButtonDisabled(false);
      setLoading(false);
    }
  };
  return (
    <Layout>
      <MasterFilter />
      <PageHeader title={"Edit Holiday"} onClick={handleBack} />
      {fetchloading ? (
        <LoaderComponent />
      ) : (
        <div className="container mx-auto ">
          <Card className="p-6 mt-2">
            <form id="addIndiv" autoComplete="off" onSubmit={onSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Holiday Name"
                  required
                  name="holiday_name"
                  value={holiday.holiday_name}
                  onChange={onInputChange}
                />
                <div className="form-group">
                  <Input
                    label="Holiday"
                    type="date"
                    name="holiday_date"
                    value={holiday.holiday_date}
                    onChange={onInputChange}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-center space-x-4 my-2">
                <ButtonConfigColor
                  type="edit"
                  buttontype="submit"
                  label="Update"
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
          </Card>
        </div>
      )}
    </Layout>
  );
};

export default EditHoliday;

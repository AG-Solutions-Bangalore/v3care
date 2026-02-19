panel-create-quotation
/panel-fetch-booking-by-id/ using this api below set in creae mode 
{
    "booking": {
        "id": 4426,
        "branch_id": 2,
        "branch_name": "Bengaluru",
        "order_ref": "V3-2025-26-4378",
        "order_status": "Inspection",
        "order_customer": "Gagan aradhya",
        "order_customer_mobile": "9611260721",
        "order_service_date": "2026-02-16",
        "order_time": "13:12",
        "order_date": "2026-02-16",
        "order_service": "Inspection",
        "order_custom": null,
        "order_amount": 0,
        "order_advance": 0,
        "order_custom_price": null,
        "order_vendor_amount": "0",
        "order_refer_by": "Suhana",
        "created_by": "Suhana",
        "created_at": "2026-02-16T06:44:44.000000Z",
        "order_vendor_id": null,
        "order_customer_email": null,
        "order_service_price_for": "Inspection",
        "order_service_sub": "Inspection",
        "order_service_price": "0",
        "order_discount": 0,
        "order_area": "Bengaluru",
        "order_flat": "06",
        "order_building": null,
        "order_landmark": "Near railway station",
        "order_address": "Shop No 06 2st Main Road, Road, SJP Road, near Railway Station, 3rd Cross, Kumbarpet, Dodpete, Nagarathpete, Bengaluru, Karnataka 560002, India",
        "order_url": "https:\/\/maps.google.com\/?cid=13566972973369280107",
        "order_locality": "Bengaluru",
        "order_sub_locality": "Nagarathpete",
        "order_km": "9.7",
        "order_payment_amount": null,
        "order_payment_type": null,
        "order_transaction_details": null,
        "order_remarks": null,
        "order_comment": null,
        "order_no_assign": 0,
        "updated_by": null,
        "updated_at": "2026-02-16T06:44:44.000000Z",
        "order_comm": null,
        "order_inspection_status": "Pending",
        "order_comm_percentage": 26,
        "order_ref_group": "V3-2025-26-4378",
        "order_person_name": null,
        "order_person_contact_no": null,
        "order_customer_alt_mobile": null
    },
    "vendor": 0,
    "bookingAssign": [],
    "bookingFollowup": []
}
this are my response
from this  you need to take the data and set
using library is material tailwind 
for input 

branch_id  - from api
quotation_date --- today date 
order_ref - from api
quotation_customer - from api
quotation_customer_mobile- from api
quotation_customer_alt_mobile- from api
quotation_customer_email- from api
quotation_customer_address- from api
sub[quotationSub_heading, quotationSub_description, quotationSub_rate, quotationSub_qnty, quotationSub_amount---> amount need to auto caluclate like rate * qunaty]


panel-fetch-quotation-by-id/{id}

panel-update-quotation/{id}

quotation_date
quotation_customer
quotation_customer_mobile
quotation_customer_alt_mobile
quotation_customer_email
quotation_customer_address
sub[id, quotationSub_heading, quotationSub_description, quotationSub_rate, quotationSub_qnty, quotationSub_amount]


import { Input } from "@material-tailwind/react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
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

the above is is my field in this i need 
import { Input } from "@material-tailwind/react";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { BASE_URL } from "../../base/BaseUrl";
import ButtonConfigColor from "../../components/common/ButtonConfig/ButtonConfigColor";
import Layout from "../../layout/Layout";
import { ContextPanel } from "../../utils/ContextPanel";
import UseEscapeKey from "../../utils/UseEscapeKey";
const status = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];
const EditVendorUser = () => {
  const { id } = useParams();
  UseEscapeKey();
  const [vendor, setVendor] = useState({
    name: "",
    mobile: "",
    email: "",
    status: "",
    remarks: "",
  });
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchEditVendorUserData = async () => {
      try {
        if (!isPanelUp) {
          navigate("/maintenance");
          return;
        }
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-admin-user-by-id/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setVendor(response.data?.adminUser);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEditVendorUserData();
    setLoading(false);
  }, []);

  const onInputChange = (e) => {
    setVendor({ ...vendor, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    let data = {
      name: vendor.name,
      mobile: vendor.mobile,
      email: vendor.email,
      status: vendor.status,
      remarks: vendor.remarks,
    };
    const token = localStorage.getItem("token");
    const idVendor = localStorage.getItem("idVendor");
    const response = await axios.put(
      `${BASE_URL}/api/panel-update-vendor-user/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.data.code == "200") {
      toast.success(response.data?.msg || "Vendor User Edit Successfull");
      navigate(`/vendor-user-list/${idVendor}`);
    } else {
      if (response.data.code == "401") {
        toast.error(response.data?.msg || "full name duplicate entry");
      } else if (response.data.code == "402") {
        toast.error(response.data?.msg || "mobile no duplicate entry");
      } else {
        toast.error(response.data?.msg || "email id duplicate entry");
      }
    }
  };
  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 ">
          Edit Vendor User {id}{" "}
        </h1>
        <div className="border border-gray-300 bg-white p-6 rounded-lg shadow-lg">
          <form id="addIndiv" autoComplete="off" onSubmit={onSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="form-group">
                <Input
                  label="Full Name"
                  type="text"
                  name="name"
                  value={vendor.name}
                  onChange={onInputChange}
                  required
                  disabled
                  labelProps={{
                    className: "!text-gray-900",
                  }}
                  className="w-full px-4 py-2 bg-gray-100 border rounded-md "
                />
              </div>

              <div className="form-group">
                <Input
                  label="Mobile No"
                  type="text"
                  name="mobile"
                  value={vendor.mobile}
                  onChange={onInputChange}
                  required
                  maxLength={10}
                  minLength={10}
                  className="w-full px-4 py-2 bg-gray-100 border rounded-md "
                />
              </div>

              <div className="form-group">
                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={vendor.email}
                  onChange={onInputChange}
                  required
                  className="w-full px-4 py-2 bg-gray-100 border rounded-md "
                />
              </div>

              <div className="form-group">
                <label className="block mb-2 text-sm font-medium">Status</label>
                <select
                  name="status"
                  value={vendor.status}
                  onChange={onInputChange}
                  required
                  className="w-full px-4 py-2 bg-gray-100 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {status.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-center space-x-4 my-2">
              <ButtonConfigColor
                type="edit"
                buttontype="submit"
                label="Update"
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
      </div>
    </Layout>
  );
};

export default EditVendorUser;

import { useEffect, useRef, useState } from "react";
import {
  Autocomplete,
  Button,
  Checkbox,
  FormControl,
  InputAdornment,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import styles from "../booking/addBooking/AddBooking.module.css";
import axios from "axios";
import { Input } from "@material-tailwind/react";
import Fields from "../../components/addBooking/TextField";
import BASE_URL from "../../base/BaseUrl";
import { useNavigate } from "react-router-dom";
import logo from "../../../public/img/v3logo.png";
import { toast } from "react-toastify";
import PageHeader from "../../components/common/PageHeader/PageHeader";
import ButtonConfigColor from "../../components/common/ButtonConfig/ButtonConfigColor";

const BecomePartner = () => {
  const navigate = useNavigate();

  const [vendor, setVendor] = useState({
    vendor_short: "",
    branch_id: "",
    vendor_company: "",
    vendor_mobile: "",
    vendor_email: "",
    vendor_aadhar_no: "",
    vendor_gst_no: "",
    vendor_images: "",
    vendor_aadhar_front: "",
    vendor_aadhar_back: "",
    vendor_aadhar_gst: "",
    vendor_service_no_count: "",
    vendor_branch_no_count: "",
    vendor_area_no_count: "",
    vendor_service_data: "",
    vendor_branch_data: "",
    vendor_area_data: "",
    vendor_ref_name_1: "",
    vendor_ref_name_2: "",
    vendor_ref_mobile_1: "",
    vendor_ref_mobile_2: "",
  });

  const [selectedFile1, setSelectedFile1] = useState(null);
  const [selectedFile2, setSelectedFile2] = useState(null);
  const [selectedFile3, setSelectedFile3] = useState(null);
  const [selectedFile4, setSelectedFile4] = useState(null);

  const [test, setTest] = useState([]);

  const handleChange = (event) => {
    setTest(event.target.value);
    console.log("check", event.target.value);
  };

  const [vendor_ser_count, setSerCount] = useState(1);
  const [vendor_branc_count, setBrancCount] = useState(1);
  const [vendor_area_count, setAreaCount] = useState(1);

  const [servicess, setServicess] = useState([]);
  const [branch, setBranch] = useState([]);
  const [loading, setLoading] = useState(false);

  const useTemplate = { vendor_service: "" };

  const [users, setUsers] = useState([useTemplate]);

  const useTemplate1 = {
    vendor_branch_flat: "",
    vendor_branch_building: "",
    vendor_branch_landmark: "",
    vendor_branch_pincode: "",
    vendor_branch_location: "",
    vendor_branch_city: "",
    vendor_branch_district: "",
    vendor_branch_state: "",
  };

  const [users1, setUsers1] = useState([useTemplate1]);
  const useTemplate2 = { vendor_area: "" };

  const [users2, setUsers2] = useState([useTemplate2]);

  const [location, setLocation] = useState([]);

  const onChange1 = (e, index) => {
    const updatedUsers = users1.map((user, i) =>
      index == i
        ? Object.assign(user, { [e.target.name]: e.target.value })
        : user
    );
    setUsers1(updatedUsers);
  };

  const validateOnlyDigits = (inputtxt) => {
    const phoneno = /^\d+$/;
    return phoneno.test(inputtxt) || inputtxt.length === 0;
  };

  const onInputChange = (e) => {
    const { name, value } = e.target;
    if (
      (name === "vendor_mobile" ||
        name === "vendor_ref_mobile_1" ||
        name === "vendor_ref_mobile_2") &&
      !validateOnlyDigits(value)
    ) {
      return;
    }
    setVendor({ ...vendor, [name]: value });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-branch-out`
        );
        setBranch(response.data.branch);
      } catch (error) {
        console.error("Error fetching vendor data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-service-out`
        );
        setServicess(response.data.service);
      } catch (error) {
        console.error("Error fetching vendor data:", error);
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = document.getElementById("addIdniv");

    if (!form.checkValidity()) {
      toast.error("Fill all the filled");
      setLoading(false);

      return;
    }
    const data = new FormData();
    data.append("vendor_short", vendor.vendor_short);
    data.append("vendor_company", vendor.vendor_company);
    data.append("vendor_mobile", vendor.vendor_mobile);
    data.append("vendor_email", vendor.vendor_email);
    data.append("branch_id", vendor.branch_id);
    data.append("vendor_aadhar_no", vendor.vendor_aadhar_no);
    data.append("vendor_gst_no", vendor.vendor_gst_no);
    data.append("vendor_ref_name_1", vendor.vendor_ref_name_1);
    data.append("vendor_ref_mobile_1", vendor.vendor_ref_mobile_1);
    data.append("vendor_ref_name_2", vendor.vendor_ref_name_2);
    data.append("vendor_ref_mobile_2", vendor.vendor_ref_mobile_2);
    data.append("vendor_images", selectedFile1);
    data.append("vendor_aadhar_front", selectedFile2);
    data.append("vendor_aadhar_back", selectedFile3);
    data.append("vendor_aadhar_gst", selectedFile4);
    data.append("vendor_area_no_count", vendor_area_count);
    data.append("vendor_service_no_count", vendor_ser_count);
    data.append("vendor_branch_no_count", vendor_branc_count);
    data.append("vendor_service", test);

    // Function to append user data to FormData
    const appendUserData = (users, prefix) => {
      users.forEach((user, index) => {
        Object.keys(user).forEach((key) => {
          data.append(`${prefix}[${index}][${key}]`, user[key]);
        });
      });
    };

    appendUserData(users, "vendor_service_data");
    appendUserData(users1, "vendor_branch_data");
    appendUserData(users2, "vendor_area_data");

    const url = new URL(window.location.href);
    const id = url.searchParams.get("id");

    try {
      const response = await axios.post(
        `${BASE_URL}/api/panel-create-vendor-out`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.code == "200") {
        toast.success("Data Inserted Successfully");
        // Reset the vendor form
        setVendor({
          vendor_short: "",
          branch_id: "",
          vendor_company: "",
          vendor_mobile: "",
          vendor_email: "",
          vendor_aadhar_no: "",
          vendor_gst_no: "",
          vendor_aadhar_front: "",
          vendor_aadhar_back: "",
          vendor_aadhar_gst: "",
          vendor_service_no_count: "",
          vendor_branch_no_count: "",
          vendor_area_no_count: "",
          vendor_service_data: "",
          vendor_branch_data: "",
          vendor_area_data: "",
          vendor_images: "",
          vendor_ref_name_1: "",
          vendor_ref_mobile_1: "",
          vendor_ref_name_2: "",
          vendor_ref_mobile_2: "",
        });
        setSerCount(1);
        setBrancCount(1);
        setAreaCount(1);
        setSelectedFile1(null);
        setSelectedFile2(null);
        setSelectedFile3(null);
        setSelectedFile4(null);
      } else {
        if (response.data.code == "402") {
          toast.error("Email Id Duplicate Entry");
        } else if (response.data.code == " 403") {
          toast.error("Mobile No Duplicate Entry");
        } else {
          toast.error("Network Issue , Pls Try again later");
          setLoading(false);
        }
      }
    } catch (error) {
      console.error("Error creating vendor:", error);
      toast.error("Error creating vendor");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const CheckPincode = (test, selectedValue) => {
    const pincode = test.target.value;
    if (pincode.length == "6") {
      fetch("https://api.v3care.in/api/external/pin/" + pincode)
        .then((response) => response.json())
        .then((response) => {
          const tempUsers = [...users1];

          tempUsers[selectedValue].vendor_branch_city = response.city;
          tempUsers[selectedValue].vendor_branch_district = response.district;
          tempUsers[selectedValue].vendor_branch_state = response.state;
          setUsers1(tempUsers);
          if (response.areas != null) {
            setLocation(response.areas);
          }
        });
    }
  };

  const handleBackButton = () => {
    navigate("/");
  };

  return (
    <div className="bg-gray-200 ">
      <div className={styles["main-container-out"]}>
        <div className={styles["sub-container-out"]}>
          <PageHeader title={"Become Partner"} />

          <div className="flex justify-center mb-4">
            <img src={logo} alt="logo" className="w-24" />
          </div>
          <div className="flex justify-center mb-4 border-b-2">
            <h1 className="text-2xl font-bold pb-2">Personal Details</h1>
          </div>
          <form id="addIdniv" onSubmit={onSubmit}>
            <div className={styles["form-container-div"]}>
              <div className="grid  grid-cols-1 md:grid-cols-3 gap-3 w-full">
                <div className="form-group">
                  <Fields
                    type="textField"
                    title="Nick Name"
                    name="vendor_short"
                    value={vendor.vendor_short}
                    onChange={(e) => onInputChange(e)}
                  />
                </div>
                <div className="form-group">
                  <Fields
                    required={true}
                    type="textField"
                    title="Company"
                    autoComplete="Name"
                    name="vendor_company"
                    value={vendor.vendor_company}
                    onChange={(e) => onInputChange(e)}
                  />
                </div>
                <div>
                  <Input
                    required
                    maxLength={10}
                    label="Mobile No"
                    type="tel"
                    name="vendor_mobile"
                    value={vendor.vendor_mobile}
                    onChange={(e) => onInputChange(e)}
                  />
                </div>
              </div>
              <div className={styles["second-div"]}>
                <div>
                  <Fields
                    types="email"
                    title="Email"
                    required
                    type="textField"
                    autoComplete="Name"
                    name="vendor_email"
                    value={vendor.vendor_email}
                    onChange={(e) => onInputChange(e)}
                  />
                </div>
                <div>
                  <Fields
                    required="required"
                    title="Branch"
                    type="branchDropdown"
                    autoComplete="Name"
                    name="branch_id"
                    value={vendor.branch_id}
                    onChange={(e) => onInputChange(e)}
                    options={branch}
                  />
                </div>

                <div>
                  <Input
                    required
                    maxLength={12}
                    label="Aadhar No"
                    type="text"
                    name="vendor_aadhar_no"
                    value={vendor.vendor_aadhar_no}
                    onChange={(e) => onInputChange(e)}
                  />
                </div>
                <div>
                  <Input
                    maxLength={15}
                    label="GST No"
                    type="text"
                    name="vendor_gst_no"
                    value={vendor.vendor_gst_no}
                    onChange={(e) => onInputChange(e)}
                  />
                </div>
              </div>
              <div className={styles["third-div-out"]}>
                <div>
                  <Input
                    required
                    label="Photo"
                    type="file"
                    autoComplete="Name"
                    name="vendor_images"
                    onChange={(e) => setSelectedFile1(e.target.files[0])}
                  />
                </div>
                <div>
                  <Input
                    type="file"
                    required
                    label="Aadhar Card Front Side"
                    InputLabelProps={{ shrink: true }}
                    autoComplete="Name"
                    name="vendor_aadhar_front"
                    onChange={(e) => setSelectedFile2(e.target.files[0])}
                  />
                </div>

                <div>
                  <Input
                    fullWidth
                    type="file"
                    required
                    label="Aadhar Card Back Side"
                    InputLabelProps={{ shrink: true }}
                    autoComplete="Name"
                    name="vendor_aadhar_back"
                    onChange={(e) => setSelectedFile3(e.target.files[0])}
                  />
                </div>
                <div>
                  <Input
                    type="file"
                    label="GST Certificate"
                    InputLabelProps={{ shrink: true }}
                    autoComplete="Name"
                    name="vendor_aadhar_gst"
                    onChange={(e) => setSelectedFile4(e.target.files[0])}
                  />
                </div>
              </div>
              <div className={styles["third-div-out"]}>
                <div>
                  <Input
                    id="vendor_ref_name_1"
                    label="Reference  Name 1"
                    autoComplete="Name"
                    name="vendor_ref_name_1"
                    value={vendor.vendor_ref_name_1}
                    onChange={(e) => onInputChange(e)}
                  />
                </div>
                <div>
                  <Input
                    id="vendor_ref_mobile_1"
                    label="Reference  Mobile No 1"
                    inputProps={{ maxLength: 10 }}
                    autoComplete="Name"
                    name="vendor_ref_mobile_1"
                    value={vendor.vendor_ref_mobile_1}
                    onChange={(e) => onInputChange(e)}
                  />
                </div>

                <div>
                  <Input
                    id="vendor_ref_name_2"
                    label="Reference  Name 2"
                    autoComplete="Name"
                    name="vendor_ref_name_2"
                    value={vendor.vendor_ref_name_2}
                    onChange={(e) => onInputChange(e)}
                  />
                </div>
                <div>
                  <Input
                    id="vendor_ref_mobile_2"
                    label="Reference  Mobile No 2"
                    inputProps={{ maxLength: 10 }}
                    autoComplete="Name"
                    name="vendor_ref_mobile_2"
                    value={vendor.vendor_ref_mobile_2}
                    onChange={(e) => onInputChange(e)}
                  />
                </div>
              </div>
              <div className="mt-5 flex justify-center">
                <h1 className="text-xl font-bold mb-2">Services Details</h1>
              </div>
              <hr />
              <div className="grid grid-cols-1 mt-3">
                <div>
                  <div className="form-group">
                    <FormControl fullWidth>
                      <InputLabel id="service-select-label">
                        <span className="text-sm relative bottom-[6px]">
                          Service <span className="text-red-700">*</span>
                        </span>
                      </InputLabel>
                      <Select
                        sx={{ height: "40px", borderRadius: "5px" }}
                        labelId="service-select-label"
                        multiple
                        label="Service"
                        value={test}
                        onChange={handleChange}
                        required
                        renderValue={(selected) => selected.join(", ")}
                      >
                        {servicess.map((name) => (
                          <MenuItem key={name.service} value={name.service}>
                            <Checkbox
                              color="primary"
                              checked={test === name.service}
                            />
                            <ListItemText primary={name.service} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                </div>
              </div>
              <div className="mt-5 flex justify-center">
                <h1 className="text-xl font-bold mb-2">Address Details</h1>
              </div>
              <hr />
              <div>
                {users1.map((user, index) => (
                  <div key={index}>
                    <div className="grid grid-cols-1 md:grid-cols-4 mt-3 w-full gap-2">
                      <div className="form-group">
                        <Input
                          label="Pincode"
                          name="vendor_branch_pincode"
                          required
                          inputProps={{ maxLength: 6 }}
                          value={user.vendor_branch_pincode}
                          onChange={(e) => {
                            onChange1(e, index), CheckPincode(e, index);
                          }}
                        />
                      </div>
                      <div className="form-group">
                        <Input
                          label="City"
                          required
                          disabled
                          name="vendor_branch_city"
                          value={user.vendor_branch_city}
                          onChange={(e) => onChange1(e, index)}
                        />
                      </div>
                      <div className="form-group">
                        <Input
                          label="District"
                          required
                          disabled
                          name="vendor_branch_district"
                          value={user.vendor_branch_district}
                          onChange={(e) => onChange1(e, index)}
                        />
                      </div>
                      <div className="form-group">
                        <Input
                          label="State"
                          disabled
                          required
                          name="vendor_branch_state"
                          value={user.vendor_branch_state}
                          onChange={(e) => onChange1(e, index)}
                        />
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-4">
                      <div className="form-group">
                        <Fields
                          type="locationDropdown"
                          id="select-corrpreffer"
                          title="Street/Location/Village"
                          required
                          name="vendor_branch_location"
                          value={user.vendor_branch_location}
                          onChange={(e) => onChange1(e, index)}
                          options={location}
                        />
                      </div>
                      <div className="form-group">
                        <Fields
                          type="textField"
                          id="select-corrpreffer"
                          title="House #/Flat #/ Plot #"
                          name="vendor_branch_flat"
                          value={user.vendor_branch_flat}
                          onChange={(e) => onChange1(e, index)}
                        />
                      </div>
                      <div className="form-group">
                        <Fields
                          type="textField"
                          id="select-corrpreffer"
                          title="Apartment/Building"
                          name="vendor_branch_building"
                          value={user.vendor_branch_building}
                          onChange={(e) => onChange1(e, index)}
                        />
                      </div>
                      <div className="form-group">
                        <Fields
                          type="textField"
                          id="select-corrpreffer"
                          title="Landmark"
                          name="vendor_branch_landmark"
                          value={user.vendor_branch_landmark}
                          onChange={(e) => onChange1(e, index)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center space-x-4 mt-6">
                <ButtonConfigColor
                  type="submit"
                  buttontype="submit"
                  label="Submit"
                  loading={loading}
                />

                <ButtonConfigColor
                  type="back"
                  buttontype="button"
                  label="Cancel"
                  onClick={() => navigate(-1)}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BecomePartner;

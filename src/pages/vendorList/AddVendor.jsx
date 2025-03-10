import Layout from "../../layout/Layout";
import axios from "axios";
import styles from "./AddVendor.module.css";
import { Person, PhoneIphone, Email, PinDrop } from "@mui/icons-material";
import BusinessIcon from "@mui/icons-material/Business";
import HouseIcon from "@mui/icons-material/House";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import React, { useState, useEffect } from "react";
import { TextField, Autocomplete, Checkbox } from "@mui/material";
import { useRef } from "react";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CustomInput from "../../components/addVendor/CustomInput";
import Dropdown from "../../components/addVendor/Dropdown";
import BASE_URL from "../../base/BaseUrl";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import UseEscapeKey from "../../utils/UseEscapeKey";
import PageHeader from "../../components/common/PageHeader/PageHeader";
import ButtonConfigColor from "../../components/common/ButtonConfig/ButtonConfigColor";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// const theme = createTheme();

// theme.typography.h3 = {
//   fontSize: "1px",
// };
const AddVendor = () => {
  UseEscapeKey();
  const [services, setServices] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const initialVendorState = {
    vendor_short: "",
    vendor_company: "",
    vendor_mobile: "",
    vendor_email: "",
    vendor_aadhar_no: "",
    vendor_gst_no: "",
    branch_id: "",
    vendor_ref_name_1: "",
    vendor_ref_mobile_1: "",
    vendor_ref_name_2: "",
    vendor_ref_mobile_2: "",
    vendor_branch_flat: "",
    vendor_branch_building: "",
    vendor_branch_landmark: "",
    vendor_branch_pincode: "",
    vendor_branch_location: "",
    vendor_branch_city: "",
    vendor_branch_district: "",
    vendor_branch_state: "",
  };

  const inputRef1 = useRef(null);
  const inputRef2 = useRef(null);
  const inputRef3 = useRef(null);
  const inputRef4 = useRef(null);
  const resetForm = () => {
    setVendor(initialVendorState);
    setUsers1([useTemplate1]);
    setSelectedFile1(null);
    setSelectedFile2(null);
    setSelectedFile3(null);
    setSelectedFile4(null);
    setSelectedServices([]);
    if (inputRef1.current) inputRef1.current.value = "";
    if (inputRef2.current) inputRef2.current.value = "";
    if (inputRef3.current) inputRef3.current.value = "";
    if (inputRef4.current) inputRef4.current.value = "";
    setTest([]);
    setLocation([]);
    setBrancCount(1);
    setSerCount(1);
    setAreaCount(1);
  };

  const [vendor, setVendor] = useState({
    vendor_short: "",
    branch_id:
      localStorage.getItem("user_type_id") == "6"
        ? ""
        : localStorage.getItem("branch_id"),
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
  const [selectedFile1, setSelectedFile1] = React.useState(null);
  const [selectedFile2, setSelectedFile2] = React.useState(null);
  const [selectedFile3, setSelectedFile3] = React.useState(null);
  const [selectedFile4, setSelectedFile4] = React.useState(null);
  const checkboxRef = React.useRef(null);

  const [test, setTest] = useState([]);

  const handleChange = (newValue) => {
    setTest(newValue);
    console.log("check", newValue);
  };

  const [vendor_ser_count, setSerCount] = useState(1);
  const [vendor_branc_count, setBrancCount] = useState(1);
  const [vendor_area_count, setAreaCount] = useState(1);

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

  const onChange1 = (e, index) => {
    const updatedUsers = users1.map((user, i) =>
      index == i
        ? Object.assign(user, { [e.target.name]: e.target.value })
        : user
    );
    console.log("chanage", updatedUsers);
    setUsers1(updatedUsers);
  };

  const validateOnlyDigits = (inputtxt) => {
    var phoneno = /^\d+$/;
    if (inputtxt.match(phoneno) || inputtxt.length == 0) {
      return true;
    } else {
      return false;
    }
  };
  const onInputChange = (e) => {
    if (e.target.name == "vendor_mobile") {
      if (validateOnlyDigits(e.target.value)) {
        setVendor({
          ...vendor,
          [e.target.name]: e.target.value,
        });
      }
    } else if (e.target.name == "vendor_ref_mobile_1") {
      if (validateOnlyDigits(e.target.value)) {
        setVendor({
          ...vendor,
          [e.target.name]: e.target.value,
        });
      }
    } else if (e.target.name == "vendor_ref_mobile_2") {
      if (validateOnlyDigits(e.target.value)) {
        setVendor({
          ...vendor,
          [e.target.name]: e.target.value,
        });
      }
    } else {
      setVendor({
        ...vendor,
        [e.target.name]: e.target.value,
      });
    }
  };

  // Fetch branches
  useEffect(() => {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    };

    fetch(BASE_URL + "/api/panel-fetch-branch", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        const mappedOptions = data.branch.map((item) => ({
          value: item.id,
          label: item.branch_name,
        }));
        setBranches(mappedOptions);
      });
  }, []);

  // Fetch services
  useEffect(() => {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    };

    fetch(BASE_URL + "/api/panel-fetch-service", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setServices(data.service);
      })
      .catch((error) => console.error("Error fetching services:", error));
  }, []);

  const onSubmit = (e) => {
    setTest([]);

    const data = new FormData();
    data.append("vendor_short", vendor.vendor_short);
    data.append("vendor_company", vendor.vendor_company);
    data.append("vendor_mobile", vendor.vendor_mobile);
    data.append("vendor_email", vendor.vendor_email);
    data.append("vendor_aadhar_no", vendor.vendor_aadhar_no);
    data.append("vendor_gst_no", vendor.vendor_gst_no);
    data.append(
      "branch_id",
      localStorage.getItem("user_type_id") == "6"
        ? vendor.branch_id
        : localStorage.getItem("branch_id")
    );
    data.append("vendor_images", selectedFile1);
    data.append("vendor_aadhar_front", selectedFile2);
    data.append("vendor_aadhar_back", selectedFile3);
    data.append("vendor_aadhar_gst", selectedFile4);
    data.append("vendor_area_no_count", vendor_area_count);
    data.append("vendor_service_no_count", vendor_ser_count);
    data.append("vendor_branch_no_count", vendor_branc_count);
    data.append("vendor_ref_name_1", vendor.vendor_ref_name_1);
    data.append("vendor_ref_mobile_1", vendor.vendor_ref_mobile_1);
    data.append("vendor_ref_name_2", vendor.vendor_ref_name_2);
    data.append("vendor_ref_mobile_2", vendor.vendor_ref_mobile_2);
    const selectedServiceValues = test.map((service) => service.service);

    data.append("vendor_service", selectedServiceValues);

    users1.forEach((user, index) => {
      Object.keys(user).forEach((key) => {
        data.append(`vendor_branch_data[${index}][${key}]`, user[key]);
      });
    });
    var v = document.getElementById("addIndiv").checkValidity();
    var v = document.getElementById("addIndiv").reportValidity();
    e.preventDefault();
    if (v) {
      axios({
        url: BASE_URL + "/api/panel-create-vendors",
        method: "POST",
        data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }).then((res) => {
        console.log("res post", res);
        if (res.data.code == "200") {
          toast.success("Vendor Created Succesfully");
          navigate("/vendor-list");
        } else {
          if (res.data.code == "402") {
            toast.error("Mobile No Duplicate");
          } else if (res.data.code == "403") {
            toast.error("Email Duplicate");
          } else {
            toast.error("Network Issue");
          }
        }
      });
    }

    resetForm();
  };

  const [location, setLocation] = useState([]);

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

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
  return (
    <Layout>
      <PageHeader title={"Vendor Create"} />

      <Box
        sx={{
          bgcolor: "white",
          padding: "10px",
          marginTop: "15px",
          borderRadius: "10px",
        }}
      >
        <form id="addIndiv">
          <Typography variant="h6">Personal Details</Typography>

          <Box className={styles["form-container"]}>
            <CustomInput
              label="Nick Name"
              icon={Person}
              name="vendor_short"
              value={vendor.vendor_short}
              onChange={(e) => onInputChange(e)}
            />
            <CustomInput
              label="Company"
              icon={BusinessIcon}
              name="vendor_company"
              required
              value={vendor.vendor_company}
              onChange={(e) => onInputChange(e)}
            />
            <CustomInput
              label="Mobile No"
              icon={PhoneIphone}
              name="vendor_mobile"
              maxLength={10}
              // inputProps={{ minLength: 10, maxLength: 10 }}
              required
              type="tel"
              value={vendor.vendor_mobile}
              onChange={(e) => onInputChange(e)}
            />
            <CustomInput
              label="Email"
              icon={Email}
              name="vendor_email"
              required
              type="email"
              value={vendor.vendor_email}
              onChange={(e) => onInputChange(e)}
            />

            <Dropdown
              // label="Branch"
              options={branches.map((branch) => ({
                value: branch.value,
                label: branch.label,
              }))}
              name="branch_id"
              label="Branch"
              required
              value={vendor.branch_id}
              onChange={(e) => {
                setVendor((prevVendor) => ({
                  ...prevVendor,
                  branch_id: e.target.value || "",
                }));
              }}
            />

            <CustomInput
              label="Aadhar No"
              name="vendor_aadhar_no"
              maxLength={12}
              required
              // inputProps={{ maxLength: 12, minLength: 12 }}
              value={vendor.vendor_aadhar_no}
              onChange={(e) => onInputChange(e)}
            />
            <CustomInput
              label="GST No"
              name="vendor_gst_no"
              inputProps={{ maxLength: 15 }}
              value={vendor.vendor_gst_no}
              onChange={(e) => onInputChange(e)}
            />
            <CustomInput
              label="Photo"
              type="file"
              required
              name="vendor_images"
              ref={inputRef1}
              onChange={(e) => setSelectedFile1(e.target.files[0])}
            />
            <CustomInput
              label="Aadhar Card Front Side"
              type="file"
              required
              name="vendor_aadhar_front"
              ref={inputRef2}
              onChange={(e) => setSelectedFile2(e.target.files[0])}
            />
            <CustomInput
              label="Aadhar Card Back Side"
              type="file"
              required
              name="vendor_aadhar_back"
              ref={inputRef3}
              onChange={(e) => setSelectedFile3(e.target.files[0])}
            />
            <CustomInput
              label="GST Certificate"
              type="file"
              name="vendor_gst_certificate"
              ref={inputRef4}
              onChange={(e) => setSelectedFile4(e.target.files[0])}
            />
            <CustomInput
              label="Reference Name 1"
              name="vendor_ref_name_1"
              value={vendor.vendor_ref_name_1}
              onChange={(e) => onInputChange(e)}
            />
            <CustomInput
              label="Reference Mobile No 1"
              icon={PhoneIphone}
              type="tel"
              name="vendor_ref_mobile_1"
              inputProps={{ maxLength: 10 }}
              value={vendor.vendor_ref_mobile_1}
              onChange={(e) => onInputChange(e)}
            />
            <CustomInput
              label="Reference Name 2"
              name="vendor_ref_name_2"
              value={vendor.vendor_ref_name_2}
              onChange={(e) => onInputChange(e)}
            />
            <CustomInput
              label="Reference Mobile No 2"
              icon={PhoneIphone}
              type="tel"
              name="vendor_ref_mobile_2"
              inputProps={{ maxLength: 10 }}
              value={vendor.vendor_ref_mobile_2}
              onChange={(e) => onInputChange(e)}
            />
          </Box>
          <Typography
            variant="h6"
            // align="center"
            sx={{ padding: "10px" }}
          >
            Services Details
          </Typography>

          <Box>
            {/* <div>
              <h3 style={{ fontSize: "17px", fontWeight: 600 }}>Services*</h3>
            </div> */}
            <Autocomplete
              multiple
              id="checkboxes-tags-demo"
              options={services}
              value={test}
              disableCloseOnSelect
              getOptionLabel={(option) => option.service}
              onChange={(event, newValue) => handleChange(newValue)}
              renderOption={(props, option, { selected }) => {
                const { key, ...optionProps } = props;
                return (
                  <li key={key} {...optionProps}>
                    <Checkbox
                      ref={checkboxRef}
                      icon={icon}
                      checkedIcon={checkedIcon}
                      style={{ marginRight: 8 }}
                      checked={selected}
                    />
                    {option.service}
                  </li>
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  // placeholder="Choose services"
                  label={
                    <label
                      style={{
                        fontSize: 13,
                        fontFamily: "sans-serif",
                        fontWeight: 500,
                      }}
                    >
                      Choose services
                      {<span style={{ color: "red" }}>*</span>}
                    </label>
                  }
                  InputProps={{
                    ...params.InputProps,
                    style: { padding: "0px" },
                  }}
                  inputProps={{
                    ...params.inputProps,
                    style: { padding: "10px" },
                  }}
                />
              )}
            />
          </Box>

          {/* // */}
          <Typography
            variant="h6"
            // align="center"
            sx={{ padding: "10px" }}
          >
            Address Details
          </Typography>
          <Box>
            {users1.map((user, index) => (
              <div key={index} className={styles["form-container"]}>
                <CustomInput
                  label="Pincode"
                  icon={PinDrop}
                  name="vendor_branch_pincode"
                  required
                  value={user.vendor_branch_pincode}
                  onChange={(e) => {
                    onChange1(e, index), CheckPincode(e, index);
                  }}
                />
                <CustomInput
                  label={<span className="!text-gray-600">City</span>}
                  icon={LocationCityIcon}
                  name="vendor_branch_city"
                  disabled
                  required
                  value={user.vendor_branch_city}
                  onChange={(e) => onChange1(e, index)}
                />
                <CustomInput
                  label={<span className="!text-gray-600">District</span>}
                  disabled
                  required
                  name="vendor_branch_district"
                  value={user.vendor_branch_district}
                  onChange={(e) => onChange1(e, index)}
                />
                <CustomInput
                  label={<span className="!text-gray-600">State</span>}
                  disabled
                  name="vendor_branch_state"
                  required
                  value={user.vendor_branch_state}
                  onChange={(e) => onChange1(e, index)}
                />
                <Dropdown
                  label="Street/Location/Village "
                  name="vendor_branch_location"
                  required
                  onChange={(e) => onChange1(e, index)}
                  value={user.vendor_branch_location}
                  options={location.map((loc) => ({ value: loc, label: loc }))}
                />

                <CustomInput
                  label="House /Flat / Plot "
                  icon={HouseIcon}
                  name="vendor_branch_flat"
                  value={user.vendor_branch_flat}
                  onChange={(e) => onChange1(e, index)}
                />

                <CustomInput
                  label="Apartment/Building"
                  name="vendor_branch_building"
                  value={user.vendor_branch_building}
                  onChange={(e) => onChange1(e, index)}
                />
                <CustomInput
                  label="Landmark"
                  name="vendor_branch_landmark"
                  value={user.vendor_branch_landmark}
                  onChange={(e) => onChange1(e, index)}
                />
              </div>
            ))}
          </Box>
          {/* <Button
            type="submit"
            variant="contained"
            color="primary"
            onClick={(e) => onSubmit(e)}
            sx={{ mt: 3 }}
          >
            Submit */}
          <div className="flex justify-center space-x-4 my-6">
            <ButtonConfigColor
              type="submit"
              buttontype="submit"
              label="Submit"
              loading={loading}
              onClick={(e) => onSubmit(e)}
            />

            <ButtonConfigColor
              type="back"
              buttontype="button"
              label="Cancel"
              onClick={() => navigate(-1)}
            />
          </div>
        </form>
      </Box>
    </Layout>
  );
};

export default AddVendor;

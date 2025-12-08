import React, { useEffect, useRef, useState } from 'react'
import Layout from '../../../../layout/Layout'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios';
import { BASE_URL } from '../../../../base/BaseUrl';
import { toast } from 'react-toastify';
import UseEscapeKey from '../../../../utils/UseEscapeKey';
import ButtonConfigColor from '../../../../components/common/ButtonConfig/ButtonConfigColor';
import {
  CurrencyRupee,
  Email,
  MiscellaneousServices,
  PinDrop,
  Place,
} from "@mui/icons-material";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import PageHeader from '../../../../components/common/PageHeader/PageHeader';
import HomeIcon from "@mui/icons-material/Home";
import styles from "../../addBooking/AddBooking.module.css";
import Fields from '../../../../components/addBooking/TextField';
import { Input } from '@material-tailwind/react';

const whatsapp = [
  {
    value: "Yes",
    label: "Yes",
  },
  {
    value: "No",
    label: "No",
  },
];

let autoComplete;

const AddBookingReassign = () => {
  const { id } = useParams()
  const autoCompleteRef = useRef(null);
  UseEscapeKey();
  
  const [query, setQuery] = useState("");
  const [query1, setQuery1] = useState("");
  const [localityBook, setLocalityBook] = useState("");
  const [localitySubBook, setLocalitySubBook] = useState("");
  
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  today = mm + "/" + dd + "/" + yyyy;
  var todayback = yyyy + "-" + mm + "-" + dd;

  const [currentYear, setCurrentYear] = useState("");
  const userType = localStorage.getItem("user_type_id");
  
  const [booking, setBooking] = useState({
    order_date: todayback,
    order_year: currentYear,
    order_refer_by: "",
    order_customer: "",
    order_customer_mobile: "",
    order_customer_email: "",
    order_service_date: '',
    order_service: "",
    order_service_sub: "",
    order_service_price_for: "",
    order_service_price: "",
    order_custom: "",
    order_custom_price: "",
    order_discount: "",
    order_amount: "",

    order_flat: "",
    order_building: "",
    order_landmark: "",
    order_advance: "",
    order_km: "",
    order_time: "",
    order_remarks: "",
    order_comment: "",
    branch_id:
      localStorage.getItem("user_type_id") == "6"
        ? ""
        : localStorage.getItem("branch_id"),
    order_area: "",
    order_address: "",
    order_url: "",
    order_send_whatsapp: "No",
  });

  const [fetchloading, setFetchLoading] = useState(true);

  useEffect(() => {
    const fetchYearData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/fetch-year`, {});
        setCurrentYear(response.data.year.current_year);
      } catch (error) {
        console.error("Error fetching year data:", error);
      }
    };
    fetchYearData();
  }, []);

  const [serdata, setSerData] = useState([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    var theLoginToken = localStorage.getItem("token");
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: "Bearer " + theLoginToken,
      },
    };
    
    fetch(BASE_URL + "/api/panel-fetch-service", requestOptions)
      .then((response) => response.json())
      .then((data) => setSerData(data.service))
      .catch(error => console.error("Error fetching services:", error));
  }, []);

  const [timeslot, setTimeSlot] = useState([]);
  
  useEffect(() => {
    fetch(BASE_URL + "/api/panel-fetch-timeslot-out")
      .then((response) => response.json())
      .then((data) => setTimeSlot(data.timeslot))
      .catch(error => console.error("Error fetching timeslots:", error));
  }, []);

  const [serdatasub, setSerDataSub] = useState([]);
  const [pricedata, setPriceData] = useState([]);
  
  // Function to load price data
  const loadPriceData = (serviceId, subServiceId, branchId, serviceDate) => {
    if (!serviceId) return;
    
    let data = {
      order_service: serviceId,
      order_service_sub: subServiceId,
      branch_id: branchId,
      order_service_date: serviceDate,
    };

    axios({
      url: BASE_URL + "/api/panel-fetch-service-price",
      method: "POST",
      data,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      setPriceData(res.data.serviceprice || []);
    }).catch(error => {
      console.error("Error fetching price data:", error);
      setPriceData([]);
    });
  };

  const HalfA = (selectedValue) => {
    const serviceId = selectedValue.target.value;
    localStorage.setItem("tempService", serviceId);
    
    setBooking(prev => ({
      ...prev,
      order_service: serviceId,
      order_service_sub: "",
      order_service_price_for: "",
    }));
    
    // Load price data
    loadPriceData(serviceId, "", booking.branch_id, booking.order_service_date);
    
    // Load sub services
    if (serviceId && serviceId !== "1") {
      const theLoginToken = localStorage.getItem("token");
      const requestOptions = {
        method: "GET",
        headers: {
          Authorization: "Bearer " + theLoginToken,
        },
      };

      fetch(
        `${BASE_URL}/api/panel-fetch-service-sub/${serviceId}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((data) => setSerDataSub(data.servicesub || []))
        .catch((error) => console.error("Fetch error:", error));
    } else {
      setSerDataSub([]);
    }
  };

  const HalfB = (selectedValue) => {
    const subServiceId = selectedValue.target.value;
    setBooking(prev => ({
      ...prev,
      order_service_sub: subServiceId,
      order_service_price_for: "",
    }));
    
    // Load price data with new sub service
    loadPriceData(localStorage.getItem("tempService"), subServiceId, booking.branch_id, booking.order_service_date);
  };

  const HalfC = (selectedValue) => {
    const priceId = selectedValue.target.value;
    setBooking(prev => ({
      ...prev,
      order_service_price_for: priceId,
    }));
    
    let data = {
      order_service_price_for: priceId,
    };
    
    axios({
      url: BASE_URL + "/api/panel-fetch-services-prices",
      method: "POST",
      data,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      if (res.data.serviceprice) {
        setBooking(prev => ({
          ...prev,
          order_service_price: res.data.serviceprice.service_price_amount,
          order_amount: res.data.serviceprice.service_price_amount,
        }));
      }
    });
  };

  const [branch, setBranch] = useState([]);
  
  useEffect(() => {
    var theLoginToken = localStorage.getItem("token");
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: "Bearer " + theLoginToken,
      },
    };

    fetch(BASE_URL + "/api/panel-fetch-branch", requestOptions)
      .then((response) => response.json())
      .then((data) => setBranch(data.branch))
      .catch(error => console.error("Error fetching branches:", error));
  }, []);

  const [referby, setReferby] = useState([]);
  
  useEffect(() => {
    var theLoginToken = localStorage.getItem("token");
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: "Bearer " + theLoginToken,
      },
    };

    fetch(BASE_URL + "/api/panel-fetch-referby", requestOptions)
      .then((response) => response.json())
      .then((data) => setReferby(data.referby))
      .catch(error => console.error("Error fetching referby:", error));
  }, []);

  const fetchAllData = async () => {
    try {
      const bookingRes = await axios.get(`${BASE_URL}/api/panel-fetch-booking-by-id/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      
      const bookingData = bookingRes.data?.booking;
      if (bookingData) {
        console.log("Booking data loaded:", bookingData);
        
        // Set address-related states first
        setQuery(bookingData.order_address || "");
        setQuery1(bookingData.order_url || "");
        setLocalityBook(bookingData.order_locality || "");
        setLocalitySubBook(bookingData.order_sub_locality || "");

        // Store original data for matching
        const originalData = {
          serviceName: bookingData.order_service,
          subServiceName: bookingData.order_service_sub,
          priceForString: bookingData.order_service_price_for,
        };
        localStorage.setItem('originalBookingData', JSON.stringify(originalData));

        // Set basic booking data
        const updatedBooking = {
          order_date: todayback,
          order_year: currentYear,
          order_refer_by: bookingData.order_refer_by || "",
          order_customer: bookingData.order_customer || "",
          order_customer_mobile: bookingData.order_customer_mobile || "",
          order_customer_email: bookingData.order_customer_email || "",
        
          order_service: "", // Will be set after matching
          order_service_sub: "",
          order_service_price_for: "",
          order_service_price: bookingData.order_service_price || "",
          order_custom: bookingData.order_custom || "",
          order_custom_price: bookingData.order_custom_price || "",
          order_discount: bookingData.order_discount || "",
          order_amount: bookingData.order_amount || "",
          order_flat: bookingData.order_flat || "",
          order_building: bookingData.order_building || "",
          order_landmark: bookingData.order_landmark || "",
          order_advance: bookingData.order_advance || "",
          order_km: bookingData.order_km || "",
          order_time: bookingData.order_time || "",
          order_remarks: bookingData.order_remarks || "",
          order_comment: bookingData.order_comment || "",
          branch_id: bookingData.branch_id?.toString() || 
            (localStorage.getItem("user_type_id") == "6" ? "" : localStorage.getItem("branch_id")),
          order_area: bookingData.order_area || "",
          order_address: bookingData.order_address || "",
          order_url: bookingData.order_url || "",
          order_send_whatsapp: bookingData.order_send_whatsapp || 'No',
        };
        
        setBooking(updatedBooking);
        setFetchLoading(false);
      }
    } catch (error) {
      console.error("Error fetching booking data:", error);
      toast.error("Failed to load booking data");
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [id]);

  // This effect runs when service data is loaded to match with booking data
  useEffect(() => {
    if (serdata.length > 0 && booking.order_customer && booking.order_service === "") {
      const originalData = JSON.parse(localStorage.getItem('originalBookingData') || '{}');
      
      if (originalData.serviceName) {
        // Find matching service
        const matchedService = serdata.find(service => 
          service.service === originalData.serviceName
        );
        
        if (matchedService) {
          const serviceId = matchedService.id.toString();
          console.log("Matched service:", originalData.serviceName, "->", serviceId);
          
          // Update booking with service ID
          setBooking(prev => ({
            ...prev,
            order_service: serviceId,
          }));
          
          localStorage.setItem("tempService", serviceId);
          
          // Load sub-services for this service
          if (serviceId && serviceId !== "1" && originalData.subServiceName) {
            const theLoginToken = localStorage.getItem("token");
            const requestOptions = {
              method: "GET",
              headers: {
                Authorization: "Bearer " + theLoginToken,
              },
            };

            fetch(
              `${BASE_URL}/api/panel-fetch-service-sub/${serviceId}`,
              requestOptions
            )
              .then((response) => response.json())
              .then((data) => {
                const subServices = data.servicesub || [];
                setSerDataSub(subServices);
                
                // Find matching sub-service
                const matchedSubService = subServices.find(sub => 
                  sub.service_sub === originalData.subServiceName
                );
                
                if (matchedSubService) {
                  const subServiceId = matchedSubService.id.toString();
                  console.log("Matched sub-service:", originalData.subServiceName, "->", subServiceId);
                  
                  setBooking(prev => ({
                    ...prev,
                    order_service_sub: subServiceId,
                  }));
                  
                  // Load price data
                  loadPriceData(serviceId, subServiceId, booking.branch_id, booking.order_service_date);
                } else {
                  // No matching sub-service found
                  loadPriceData(serviceId, "", booking.branch_id, booking.order_service_date);
                }
              })
              .catch((error) => {
                console.error("Error fetching sub-services:", error);
                loadPriceData(serviceId, "", booking.branch_id, booking.order_service_date);
              });
          } else if (serviceId && serviceId !== "1") {
            // No sub-service name but service is not custom
            loadPriceData(serviceId, "", booking.branch_id, booking.order_service_date);
          }
        }
      }
    }
  }, [serdata, booking.order_customer]);

  // This effect runs when price data is loaded to match price_for
  useEffect(() => {
    if (pricedata.length > 0 && booking.order_service_price_for === "") {
      const originalData = JSON.parse(localStorage.getItem('originalBookingData') || '{}');
      
      if (originalData.priceForString) {
        // Try to find the price ID by matching the string
        const matchedPrice = pricedata.find(price => 
          price.service_price_for === originalData.priceForString
        );
        
        if (matchedPrice) {
          console.log("Matched price:", originalData.priceForString, "->", matchedPrice.id);
          
          setBooking(prev => ({
            ...prev,
            order_service_price_for: matchedPrice.id.toString(),
            order_service_price: matchedPrice.service_price_amount,
            order_amount: matchedPrice.service_price_amount,
          }));
        } else if (pricedata.length > 0) {
          // If no exact match, use the first available price
          setBooking(prev => ({
            ...prev,
            order_service_price_for: pricedata[0].id.toString(),
            order_service_price: pricedata[0].service_price_amount,
            order_amount: pricedata[0].service_price_amount,
          }));
        }
      }
    }
  }, [pricedata, booking.order_service_price_for]);

  const validateOnlyDigits = (inputtxt) => {
    var phoneno = /^\d+$/;
    if (inputtxt.match(phoneno) || inputtxt.length == 0) {
      return true;
    } else {
      return false;
    }
  };

  const validateOnlyNumber = (inputtxt) => {
    var phoneno = /^\d*\.?\d*$/;
    if (inputtxt.match(phoneno) || inputtxt.length == 0) {
      return true;
    } else {
      return false;
    }
  };

  const onInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name == "order_customer_mobile") {
      if (validateOnlyDigits(value)) {
        setBooking({
          ...booking,
          [name]: value,
        });
      }
    } else if (name == "order_service_price") {
      if (validateOnlyDigits(value)) {
        setBooking({
          ...booking,
          [name]: value,
        });
      }
    } else if (name == "order_custom_price") {
      if (validateOnlyDigits(value)) {
        setBooking({
          ...booking,
          [name]: value,
          order_amount: value,
        });
      }
    } else if (name == "order_amount") {
      if (validateOnlyDigits(value)) {
        setBooking({
          ...booking,
          [name]: value,
        });
      }
    } else if (name == "order_advance") {
      if (validateOnlyDigits(value)) {
        setBooking({
          ...booking,
          [name]: value,
        });
      }
    } else if (name == "order_km") {
      if (validateOnlyNumber(value)) {
        setBooking({
          ...booking,
          [name]: value,
        });
      }
    } else if (name == "order_pincode") {
      if (validateOnlyDigits(value)) {
        setBooking({
          ...booking,
          [name]: value,
        });
      }
    } else {
      setBooking({
        ...booking,
        [name]: value,
      });
    }
  };

  const handleScriptLoad = (updateQuery, autoCompleteRef) => {
    autoComplete = new window.google.maps.places.Autocomplete(
      autoCompleteRef.current,
      {
        componentRestrictions: { country: "IN" },
      }
    );

    autoComplete.addListener("place_changed", () => {
      handlePlaceSelect(updateQuery);
    });
  };

  const handlePlaceSelect = async (updateQuery) => {
    const addressObject = await autoComplete.getPlace();
    const query = addressObject.formatted_address;
    const url = addressObject.url;
    updateQuery(query);
    
    let subLocality = "";
    let locality = "";

    addressObject.address_components.forEach((component) => {
      if (component.types.includes("sublocality_level_1")) {
        subLocality = component.short_name;
      }
      if (component.types.includes("locality")) {
        locality = component.short_name;
      }
    });

    setLocalitySubBook(subLocality);
    setLocalityBook(locality);
    setQuery1(url);
  };

  useEffect(() => {
    if (window.google && window.google.maps && window.google.maps.places) {
      handleScriptLoad(setQuery, autoCompleteRef);
    } else {
      console.error("Google Maps API not loaded!");
    }
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    const form = document.getElementById("addIdniv");

    if (!form.checkValidity()) {
      toast.error("Fill all the fields");
      return;
    }

    let data = {
      order_date: booking.order_date,
      order_year: currentYear,
      order_refer_by: booking.order_refer_by,
      order_customer: booking.order_customer,
      order_customer_mobile: booking.order_customer_mobile,
      order_customer_email: booking.order_customer_email,
      order_service_date: booking.order_service_date,
      order_service: booking.order_service,
      order_service_sub: booking.order_service_sub,
      order_service_price_for: booking.order_service_price_for,
      order_service_price: booking.order_service_price,
      order_custom: booking.order_custom,
      order_custom_price: booking.order_custom_price,
      order_discount: booking.order_discount,
      order_amount: booking.order_amount,
      order_advance: booking.order_advance,
      order_flat: booking.order_flat,
      order_building: booking.order_building,
      order_landmark: booking.order_landmark,
      order_km: booking.order_km,
      order_time: booking.order_time,
      order_remarks: booking.order_remarks,
      order_sub_locality: localitySubBook,
      order_locality: localityBook,
      order_comment: booking.order_comment,
      branch_id:
        userType == 6 || userType == 8
          ? booking.branch_id
          : localStorage.getItem("branch_id"),
      order_area: booking.order_area,
      order_address: query,
      order_url: query1,
      order_send_whatsapp: booking.order_send_whatsapp,
    };

    const elem = document.getElementById("addIdniv");
    const v = elem.checkValidity() && elem.reportValidity();

    if (v) {
      axios({
        url: BASE_URL + "/api/panel-create-booking",
        method: "POST",
        data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }).then((res) => {
        if (res.data.code == "200") {
          toast.success(res.data?.msg || "Booking Create Successfully");
          navigate("/today");
        } else {
          toast.error(res.data?.msg || "Duplicate Entry");
        }
      });
    }
  };

  return (
    <Layout>
      <PageHeader title={"Booking Reassign "} />

      <div className={styles["sub-container"]}>
        {fetchloading ? (
          <div className="text-center p-8">Loading...</div>
        ) : (
          <form id="addIdniv" onSubmit={onSubmit}>
            <div className={styles["form-container"]}>
              <div>
                <FormControl fullWidth>
                  <InputLabel id="order_refer_by-label">
                    <span className="text-sm relative bottom-[6px]">
                      Referred By <span className="text-red-700">*</span>
                    </span>
                  </InputLabel>
                  <Select
                    sx={{ height: "40px", borderRadius: "5px" }}
                    labelId="order_refer_by-label"
                    id="order_refer_by"
                    name="order_refer_by"
                    value={booking.order_refer_by}
                    onChange={onInputChange}
                    label="Referred By *"
                    required
                  >
                    {referby.map((data) => (
                      <MenuItem key={data.refer_by} value={data.refer_by}>
                        {data.refer_by}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <div className="form-group">
                  <Fields
                    required="required"
                    title="Customer Name"
                    type="textField"
                    autoComplete="Name"
                    name="order_customer"
                    maxLength={50}
                    value={booking.order_customer}
                    onChange={(e) => onInputChange(e)}
                  />
                </div>
                <div>
                  <Input
                    label="Mobile No"
                    required
                    maxLength={10}
                    types="tel"
                    title="Mobile No"
                    type="numberField"
                    autoComplete="Name"
                    name="order_customer_mobile"
                    value={booking.order_customer_mobile}
                    onChange={(e) => onInputChange(e)}
                  />
                </div>
                <div>
                  <Fields
                    types="email"
                    title="Email"
                    type="textField"
                    autoComplete="Name"
                    name="order_customer_email"
                    value={booking.order_customer_email}
                    onChange={(e) => onInputChange(e)}
                    startIcon={<Email sx={{ color: "red" }} />}
                  />
                </div>
              </div>
              <div className={styles["second-div"]}>
                <div>
                  <Input
                    fullWidth
                    label="Service Date"
                    required
                    id="order_service_date"
                    min={today}
                    type="date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    autoComplete="Name"
                    name="order_service_date"
                    value={booking.order_service_date}
                    onChange={(e) => onInputChange(e)}
                  />
                </div>
                {userType == 6 || userType == 8 ? (
                  <div>
                    <FormControl fullWidth>
                      <InputLabel id="branch_id-label">
                        <span className="text-sm relative bottom-[6px]">
                          Branch <span className="text-red-700">*</span>
                        </span>
                      </InputLabel>
                      <Select
                        sx={{ height: "40px", borderRadius: "5px" }}
                        labelId="branch_id-label"
                        id="branch_id"
                        name="branch_id"
                        value={booking.branch_id}
                        onChange={(e) => onInputChange(e)}
                        label="Branch *"
                        required
                      >
                        {branch.map((data) => (
                          <MenuItem key={data.id} value={data.id}>
                            {data.branch_name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                ) : (
                  ""
                )}
                <div>
                  <FormControl fullWidth>
                    <InputLabel id="order_service-label">
                      <span className="text-sm relative bottom-[6px]">
                        Service <span className="text-red-700">*</span>
                      </span>
                    </InputLabel>
                    <Select
                      sx={{ height: "40px", borderRadius: "5px" }}
                      labelId="order_service-label"
                      id="order_service"
                      name="order_service"
                      value={booking.order_service}
                      onChange={(e) => {
                        HalfA(e);
                      }}
                      label="Service *"
                      required
                    >
                      {serdata.map((data) => (
                        <MenuItem key={data.id} value={data.id}>
                          {data.service}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>

                {booking.order_service && booking.order_service !== "1" && serdatasub.length > 0 ? (
                  <div>
                    <FormControl fullWidth>
                      <InputLabel id="order_service_sub-label">
                        <span className="text-sm relative bottom-[6px]">
                          Service Sub <span className="text-red-700">*</span>
                        </span>
                      </InputLabel>
                      <Select
                        sx={{ height: "40px", borderRadius: "5px" }}
                        labelId="order_service_sub-label"
                        id="order_service_sub"
                        name="order_service_sub"
                        value={booking.order_service_sub}
                        onChange={(e) => {
                          HalfB(e);
                        }}
                        label="Service Sub *"
                        required
                      >
                        {serdatasub.map((data) => (
                          <MenuItem key={data.id} value={data.id}>
                            {data.service_sub}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                ) : (
                  ""
                )}
                {booking.order_service && booking.order_service !== "1" && pricedata.length > 0 ? (
                  <div>
                    <FormControl fullWidth>
                      <InputLabel id="order_service_price_for-label">
                        <span className="text-sm relative bottom-[6px]">
                          Price For <span className="text-red-700">*</span>
                        </span>
                      </InputLabel>
                      <Select
                        sx={{ height: "40px", borderRadius: "5px" }}
                        labelId="order_service_price_for-label"
                        id="order_service_price_for"
                        name="order_service_price_for"
                        value={booking.order_service_price_for}
                        onChange={(e) => {
                          HalfC(e);
                        }}
                        label="Price For *"
                        required
                      >
                        {pricedata.map((data) => (
                          <MenuItem key={data.id} value={data.id}>
                            {data.service_price_for} - {data.service_price_rate}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                ) : (
                  ""
                )}
              </div>
              <div className={styles["custom-service-dev"]}>
                {booking.order_service == "1" && (
                  <>
                    <div>
                      <Fields
                        types="text"
                        title="Custom Service"
                        type="textField"
                        autoComplete="Name"
                        name="order_custom"
                        value={booking.order_custom}
                        onChange={(e) => onInputChange(e)}
                        startIcon={
                          <MiscellaneousServices sx={{ color: "red" }} />
                        }
                      />
                    </div>

                    <div>
                      <Fields
                        types="text"
                        title="Custom Price"
                        type="textField"
                        autoComplete="Name"
                        name="order_custom_price"
                        value={booking.order_custom_price}
                        onChange={(e) => onInputChange(e)}
                        startIcon={<CurrencyRupee sx={{ color: "red" }} />}
                      />
                    </div>
                  </>
                )}
              </div>
              <div className={styles["third-div"]}>
                <div>
                  <Fields
                    required="required"
                    types="text"
                    title="Amount"
                    type="textField"
                    autoComplete="Name"
                    name="order_amount"
                    value={booking.order_amount}
                    maxLength={10}
                    onChange={(e) => onInputChange(e)}
                    startIcon={<CurrencyRupee sx={{ color: "red" }} />}
                  />
                </div>
                <div>
                  <Fields
                    types="text"
                    title="Advance"
                    type="textField"
                    autoComplete="Name"
                    name="order_advance"
                    maxLength={10}
                    value={booking.order_advance}
                    onChange={(e) => onInputChange(e)}
                    startIcon={<CurrencyRupee sx={{ color: "red" }} />}
                  />
                </div>

                <FormControl fullWidth>
                  <InputLabel id="order_time-label">
                    <span className="text-sm relative bottom-[6px]">
                      Time Slot<span className="text-red-700">*</span>
                    </span>
                  </InputLabel>
                  <Select
                    sx={{ height: "40px", borderRadius: "5px" }}
                    labelId="order_time-label"
                    id="order_time"
                    name="order_time"
                    value={booking.order_time}
                    onChange={(e) => onInputChange(e)}
                    label="Time Slot *"
                    required
                  >
                    {timeslot.map((data) => (
                      <MenuItem key={data.id || data.time_slot} value={data?.time_slot}>
                        {data?.time_slot}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <div>
                  <Fields
                    types="number"
                    title="KM"
                    type="textField"
                    autoComplete="Name"
                    maxLength={8}
                    name="order_km"
                    value={booking.order_km}
                    onChange={(e) => onInputChange(e)}
                    startIcon={<PinDrop sx={{ color: "orange" }} />}
                  />
                </div>
              </div>
              <div className="text-2xl p-2">
                <h1> Address</h1>
              </div>
              <hr />
              <div className={styles["address-div"]}>
                <div>
                  <Typography variant="small" className={styles["heading"]}>
                    Search Place <span style={{ color: "red" }}> *</span>
                  </Typography>
                  <input
                    className={styles["search-div"]}
                    ref={autoCompleteRef}
                    id="order_address"
                    required
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search Place"
                    value={query}
                  />
                </div>
              </div>
              <div className={styles["address-first-div"]}>
                <div>
                  <Fields
                    required="required"
                    types="text"
                    title="House #/Flat #/ Plot #"
                    type="textField"
                    autoComplete="Name"
                    name="order_flat"
                    maxLength={80}
                    value={booking.order_flat}
                    onChange={(e) => onInputChange(e)}
                    startIcon={<HomeIcon sx={{ color: "green" }} />}
                  />
                </div>
                <div>
                  <Fields
                    required="required"
                    types="text"
                    title="Landmark"
                    type="textField"
                    autoComplete="Name"
                    name="order_landmark"
                    maxLength={80}
                    value={booking.order_landmark}
                    onChange={(e) => onInputChange(e)}
                    startIcon={<Place sx={{ color: "green" }} />}
                  />
                </div>
              </div>
              <div className={styles["address-second-div"]}>
                <div>
                  <Fields
                    required="required"
                    title="Send Whatsapp to Customer"
                    type="whatsappDropdown"
                    autoComplete="Name"
                    name="order_send_whatsapp"
                    value={booking.order_send_whatsapp}
                    onChange={(e) => onInputChange(e)}
                    options={whatsapp}
                  />
                </div>
                <div>
                  <Fields
                    types="text"
                    title="Remarks"
                    multiline="multiline"
                    type="textField"
                    autoComplete="Name"
                    name="order_remarks"
                    maxLength={80}
                    value={booking.order_remarks}
                    onChange={(e) => onInputChange(e)}
                    startIcon={<Place sx={{ color: "green" }} />}
                  />
                </div>
              </div>

              <div className="flex justify-center space-x-4 mt-2">
                <ButtonConfigColor
                  type="submit"
                  buttontype="submit"
                  label="Submit"
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
        )}
      </div>
    </Layout>
  )
}

export default AddBookingReassign
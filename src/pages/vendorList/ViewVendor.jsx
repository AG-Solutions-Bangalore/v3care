import Layout from "../../layout/Layout";
import React, { useRef, useState, useEffect, useContext } from "react";
import { FaPrint } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import ReactToPrint from "react-to-print";
import { ContextPanel } from "../../utils/ContextPanel";
import axios from "axios";
import BASE_URL from "../../base/BaseUrl";
import UseEscapeKey from "../../utils/UseEscapeKey";
import { Card, CardBody } from "@material-tailwind/react";
import { IoMdArrowRoundBack } from "react-icons/io";

const ViewVendor = () => {
  const componentRef = useRef();
  const { id } = useParams();
  UseEscapeKey();
  // Custom state for vendor data
  const [vendor, setVendor] = useState({});
  const [vendorArea, setVendorArea] = useState([]);
  const [vendorService, setVendorService] = useState([]);
  const [vendorBranch, setVendorBranch] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
  const storedPageNo = localStorage.getItem("page-no");
  const pageNo =
    storedPageNo === "null" || storedPageNo === null ? "1" : storedPageNo;
  const navigate = useNavigate();
  useEffect(() => {
    const fetchVendorViewData = async () => {
      try {
        if (!isPanelUp) {
          navigate("/maintenance");
          return;
        }
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-vendor-by-id/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setVendor(response.data?.vendor);
        setVendorArea(response.data?.vendorArea);
        setVendorService(response.data?.vendorService);
        setVendorBranch(response.data?.vendorbranch);
      } catch (error) {
        console.error("Error fetching vendor list data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVendorViewData();
    setLoading(false);
  }, []);
  const handleBack = (e) => {
    e.preventDefault();
    navigate(`/vendor-list?page=${pageNo}`);
  };
  return (
    <Layout>
      <div className="container mx-auto p-6">
        <div className="w-full bg-white shadow-md rounded-lg p-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold border-b  border-blue-700 flex ">
              <IoMdArrowRoundBack
                className="cursor-pointer"
                onClick={handleBack}
              />{" "}
              Vendor Details
            </h1>
            <ReactToPrint
              trigger={() => (
                <button className="text-blue-500 border border-blue-400 p-2 rounded-lg hover:text-blue-700 flex items-center space-x-2">
                  <FaPrint />
                  <span>Print</span>
                </button>
              )}
              content={() => componentRef.current}
            />
          </div>

          <div ref={componentRef} className="mt-6 px-2">
            <div className="mb-8 ">
              <h2 className="text-xl font-semibold">
                {vendor.vendor_company} ({vendor.vendor_short}) -{" "}
                {vendor.vendor_status}
              </h2>
            </div>

            {/* Add a black border around the entire section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4">
              <div>
                <h3 className="font-semibold text-lg">Contact Information</h3>
                <table className="w-full mt-2 border-collapse border border-black">
                  <tbody>
                    <tr className="border-b border-black">
                      <th className="text-left p-2 border-r border-black">
                        Mobile
                      </th>
                      <td className="p-2">:</td>
                      <td className="p-2">{vendor.vendor_mobile}</td>
                    </tr>
                    <tr className="border-b border-black">
                      <th className="text-left p-2 border-r border-black">
                        Email
                      </th>
                      <td className="p-2">:</td>
                      <td className="p-2">{vendor.vendor_email}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div>
                <h3 className="font-semibold text-lg">Identification</h3>
                <table className="w-full mt-2 border-collapse border border-black">
                  <tbody>
                    <tr className="border-b border-black">
                      <th className="text-left p-2 border-r border-black">
                        Aadhar No
                      </th>
                      <td className="p-2">:</td>
                      <td className="p-2">{vendor.vendor_aadhar_no}</td>
                    </tr>
                    <tr className="border-b border-black">
                      <th className="text-left p-2 border-r border-black">
                        GST No
                      </th>
                      <td className="p-2">:</td>
                      <td className="p-2">{vendor.vendor_gst_no}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className=" p-4">
              <h3 className="font-semibold text-lg">Area</h3>
              <table className="w-full mt-2 border-collapse border border-black">
                <tbody>
                  {vendorArea.map((area, index) => (
                    <tr key={index} className="border-b border-black">
                      <td className="p-2">{area.vendor_area}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-lg mb-4">Services</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4">
                {vendorService.map((service, index) => (
                  <div
                    key={index}
                    className=" p-4 border border-black rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <p className="text-black font-medium">
                      {service.vendor_service}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="  p-4">
              <h3 className="font-semibold text-lg">Branch Address</h3>
              <table className="w-full mt-2 border-collapse border border-black">
                <tbody>
                  {vendorBranch.map((branch, index) => (
                    <tr key={index} className="border-b border-black">
                      <td className="p-2">
                        {branch.vendor_branch_flat},{" "}
                        {branch.vendor_branch_building},{" "}
                        {branch.vendor_branch_landmark},{" "}
                        {branch.vendor_branch_location},{" "}
                        {branch.vendor_branch_city} -{" "}
                        {branch.vendor_branch_district},{" "}
                        {branch.vendor_branch_state} -{" "}
                        {branch.vendor_branch_pincode}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ViewVendor;

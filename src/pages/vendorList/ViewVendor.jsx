import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { FaFileDownload, FaMap } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import {
  BASE_URL,
  VENDOR_ADAHAR_BACK_URL,
  VENDOR_ADAHAR_FRONT_URL,
  VENDOR_GST_URL,
  VENDOR_IMAGE_URL,
} from "../../base/BaseUrl";
import ButtonConfigColor from "../../components/common/ButtonConfig/ButtonConfigColor";
import LoaderComponent from "../../components/common/LoaderComponent";
import PageHeader from "../../components/common/PageHeader/PageHeader";
import Layout from "../../layout/Layout";
import { ContextPanel } from "../../utils/ContextPanel";
import UseEscapeKey from "../../utils/UseEscapeKey";

const ViewVendor = () => {
  const componentRef = useRef();
  const { id } = useParams();
  UseEscapeKey();
  const [vendor, setVendor] = useState({});
  const [vendorArea, setVendorArea] = useState([]);
  const [vendorService, setVendorService] = useState([]);
  const [vendorBranch, setVendorBranch] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
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
  }, []);
  
  const handlePrintPdf = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Vendor_Report",
    pageStyle: `
      @page {
        size: A4 landscape;
        margin: 5mm;
      }
      @media print {
        body {
          border: 0px solid #000;
          font-size: 12px; 
          margin: 0mm;
          padding: 0mm;
          min-height: 100vh;
        }
        table {
          font-size: 11px;
        }
        .print-hide {
          display: none;
        }
      }
    `,
  });
  
  return (
    <Layout>
      <PageHeader
        title="Vendor Details"
        label2={
          <ButtonConfigColor
            type="print"
            label="Print"
            onClick={handlePrintPdf}
          />
        }
      />
      {loading ? (
        <LoaderComponent />
      ) : (
        <div className="container mx-auto mt-2">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-300" ref={componentRef}>
            <div className="text-center mb-4 pb-3 border-b border-gray-300">
              <h1 className="text-xl font-bold text-gray-900 mb-1">
                VENDOR DETAILS REPORT
              </h1>
              <p className="text-sm text-gray-700">
                {vendor.vendor_company} ({vendor.vendor_short}) - {vendor.vendor_status}
              </p>
            </div>

            <div className="flex flex-row items-center gap-2 justify-end mb-4 print-hide">
              {vendorBranch[0]?.vendor_branch_url && (
                <button
                  onClick={() => window.open(vendorBranch[0]?.vendor_branch_url, "_blank")}
                  className="px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100 font-medium"
                >
                  <div className="flex items-center">
                    <FaMap className="mr-1" />
                    Location
                  </div>
                </button>
              )}
              
              <button
                onClick={() => window.open(`${VENDOR_ADAHAR_FRONT_URL}/` + vendor?.vendor_aadhar_front, "_blank")}
                className="px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100 font-medium"
              >
                <div className="flex items-center">
                  <FaFileDownload className="mr-1" />
                  Aadhar Front
                </div>
              </button>
              
              <button
                onClick={() => window.open(`${VENDOR_ADAHAR_BACK_URL}/` + vendor?.vendor_aadhar_back, "_blank")}
                className="px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100 font-medium"
              >
                <div className="flex items-center">
                  <FaFileDownload className="mr-1" />
                  Aadhar Back
                </div>
              </button>

              <button
                onClick={() => window.open(`${VENDOR_GST_URL}/` + vendor?.vendor_aadhar_gst, "_blank")}
                className="px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100 font-medium"
              >
                <div className="flex items-center">
                  <FaFileDownload className="mr-1" />
                  GST
                </div>
              </button>

              <button
                onClick={() => window.open(`${VENDOR_IMAGE_URL}/` + vendor?.vendor_images, "_blank")}
                className="px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100 font-medium"
              >
                <div className="flex items-center">
                  <FaFileDownload className="mr-1" />
                  Vendor
                </div>
              </button>
            </div>

            {/* Contact and Identification Information */}
            <div className="grid grid-cols-1 print:grid-cols-2 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h2 className="text-md font-semibold text-gray-800 mb-2 border-b border-gray-300 pb-1">
                  CONTACT INFORMATION
                </h2>
                <div className="overflow-x-auto border border-black bg-white">
                  <table className="w-full border-collapse">
                    <tbody>
                      <tr className="border-b border-black">
                        <th className="text-left p-2 border-r border-black bg-gray-100">
                          Mobile
                        </th>
                        <td className="p-2">{vendor.vendor_mobile || "-"}</td>
                      </tr>
                      <tr className="border-b border-black">
                        <th className="text-left p-2 border-r border-black bg-gray-100">
                          Email
                        </th>
                        <td className="p-2">{vendor.vendor_email || "-"}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h2 className="text-md font-semibold text-gray-800 mb-2 border-b border-gray-300 pb-1">
                  IDENTIFICATION
                </h2>
                <div className="overflow-x-auto border border-black bg-white">
                  <table className="w-full border-collapse">
                    <tbody>
                      <tr className="border-b border-black">
                        <th className="text-left p-2 border-r border-black bg-gray-100">
                          Aadhar No
                        </th>
                        <td className="p-2">{vendor.vendor_aadhar_no || "-"}</td>
                      </tr>
                      <tr className="border-b border-black">
                        <th className="text-left p-2 border-r border-black bg-gray-100">
                          GST No
                        </th>
                        <td className="p-2">{vendor.vendor_gst_no || "-"}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Vendor Information */}
            <div className="mb-4">
              <h2 className="text-md font-semibold text-gray-800 mb-2 border-b border-gray-300 pb-1">
                VENDOR INFORMATION
              </h2>
              <div className="overflow-x-auto border border-black bg-white">
                <table className="w-full border-collapse">
                  <tbody>
                    <tr className="border-b border-black">
                      <th className="text-left p-2 border-r border-black bg-gray-100">
                        Job Skills
                      </th>
                      <td className="p-2">{vendor.vendor_job_skills || "-"}</td>
                    </tr>
                    <tr className="border-b border-black">
                      <th className="text-left p-2 border-r border-black bg-gray-100">
                        Training
                      </th>
                      <td className="p-2">{vendor.vendor_training || "-"}</td>
                    </tr>
                    <tr className="border-b border-black">
                      <th className="text-left p-2 border-r border-black bg-gray-100">
                        Trained By
                      </th>
                      <td className="p-2">{vendor.vendor_trained_bywhom || "-"}</td>
                    </tr>
                    <tr className="border-b border-black">
                      <th className="text-left p-2 border-r border-black bg-gray-100">
                        Last Training Date
                      </th>
                      <td className="p-2">{vendor.vendor_last_training_date || "-"}</td>
                    </tr>
                    <tr className="border-b border-black">
                      <th className="text-left p-2 border-r border-black bg-gray-100">
                        Date of Joining
                      </th>
                      <td className="p-2">{vendor.vendor_date_of_joining || "-"}</td>
                    </tr>
                    <tr className="border-b border-black">
                      <th className="text-left p-2 border-r border-black bg-gray-100">
                        Members
                      </th>
                      <td className="p-2">{vendor.vendor_members || "-"}</td>
                    </tr>
                    <tr className="border-b border-black">
                      <th className="text-left p-2 border-r border-black bg-gray-100">
                        Years of Experience
                      </th>
                      <td className="p-2">
                        {vendor.vendor_years_experience} {vendor.vendor_years_experience ? "yrs" : ""}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Area Information */}
            <div className="mb-4">
              <h2 className="text-md font-semibold text-gray-800 mb-2 border-b border-gray-300 pb-1">
                AREA COVERAGE
              </h2>
              <div className="overflow-x-auto border border-black bg-white">
                <table className="w-full border-collapse">
                  <tbody>
                    {vendorArea.map((area, index) => (
                      <tr key={index} className="border-b border-black">
                        <td className="p-2">{area.vendor_area}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Services Information */}
            <div className="mb-4">
              <h2 className="text-md font-semibold text-gray-800 mb-2 border-b border-gray-300 pb-1">
                SERVICES
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {vendorService.map((service, index) => (
                  <div
                    key={index}
                    className="p-2 border border-gray-300 rounded bg-white text-center"
                  >
                    <p className="text-black font-medium text-sm">
                      {service.vendor_service}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Branch Address Information */}
            <div className="mb-4">
              <h2 className="text-md font-semibold text-gray-800 mb-2 border-b border-gray-300 pb-1">
                BRANCH ADDRESS
              </h2>
              <div className="overflow-x-auto border border-black bg-white">
                <table className="w-full border-collapse">
                  <tbody>
                    {vendorBranch.map((branch, index) => (
                      <tr key={index} className="border-b border-black">
                        <td className="p-2">
                          {branch.vendor_branch_flat && `${branch.vendor_branch_flat}, `}
                          {branch.vendor_branch_building && `${branch.vendor_branch_building}, `}
                          {branch.vendor_branch_landmark && `${branch.vendor_branch_landmark}, `}
                          {branch.vendor_branch_location && `${branch.vendor_branch_location}, `}
                          {branch.vendor_branch_city && `${branch.vendor_branch_city} - `}
                          {branch.vendor_branch_district && `${branch.vendor_branch_district}, `}
                          {branch.vendor_branch_state && `${branch.vendor_branch_state} - `}
                          {branch.vendor_branch_pincode || ""}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ViewVendor;
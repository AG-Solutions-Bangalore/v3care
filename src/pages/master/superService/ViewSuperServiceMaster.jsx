import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import {
  BASE_URL,
  NO_IMAGE_URL,
  SERVICE_IMAGE_URL,
  SERVICE_SUB_IMAGE_URL,
} from "../../../base/BaseUrl";
import ButtonConfigColor from "../../../components/common/ButtonConfig/ButtonConfigColor";
import LoaderComponent from "../../../components/common/LoaderComponent";
import PageHeader from "../../../components/common/PageHeader/PageHeader";
import Layout from "../../../layout/Layout";
const getServiceLabel = (val) => {
  switch (val) {
    case 1:
      return (
        <span
          key={val}
          className="px-2 py-1 rounded text-black bg-gray-400 mr-1"
        >
          Popular
        </span>
      );
    case 2:
      return (
        <span
          key={val}
          className="px-2 py-1 rounded text-black bg-gray-400 mr-1"
        >
          Most Popular
        </span>
      );
    case 3:
      return (
        <span
          key={val}
          className="px-2 py-1 rounded text-black bg-gray-400 mr-1"
        >
          Super Popular
        </span>
      );
    default:
      return (
        <span
          key={val}
          className="px-2 py-1 rounded text-white bg-gray-400 mr-1"
        >
          Unknown
        </span>
      );
  }
};

const renderServiceLabels = (valueString) => {
  if (!valueString) return getServiceLabel("unknown");

  const values = valueString.split(",").map((v) => parseInt(v.trim(), 10));
  return values.map((val) => getServiceLabel(val));
};

const ViewSuperServiceMaster = () => {
  const [serviceData, setServiceData] = useState({});
  const [servicesubData, setServiceSubData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const containerRef = useRef();
  const { id } = useParams();

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-service-view-by-id/${id}`,

          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setServiceData(response?.data?.service || {});
        setServiceSubData(response?.data?.serviceSub || []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchBookingData();
  }, [id]);

  const handlePrintPdf = useReactToPrint({
    content: () => containerRef.current,
    documentTitle: "Service_Report",
    pageStyle: `
            @page {
              size: A4 portrait;
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

  if (loading) {
    return (
      <Layout>
        <LoaderComponent />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="bg-gray-100 p-4 mt-5 rounded-lg border border-gray-300 text-gray-700">
          <p className="font-semibold">Error encountered:</p>
          <p>{error}</p>
        </div>
      </Layout>
    );
  }

  if (!serviceData) {
    return (
      <Layout>
        <div className="bg-gray-100 p-4 rounded-lg mt-5 border border-gray-300 text-gray-700">
          <p>No data available.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div>
        <PageHeader
          title={"View Super Services"}
          label2={
            <span className="flex justify-between space-x-4">
              <ButtonConfigColor
                type="print"
                label="Print"
                onClick={handlePrintPdf}
              />
            </span>
          }
        />

        <div
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-300 mt-2"
          ref={containerRef}
        >
          <div className="mb-4">
            <h2 className="text-md font-semibold text-center mb-4 hidden print:block ">
              SUPER SERVICE REPORT
            </h2>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-md font-semibold text-gray-800">
                {serviceData?.service}
              </h2>
              <span className="text-sm font-bold text-gray-800">
                {renderServiceLabels(serviceData?.service_show_website)}
              </span>
            </div>

            {/* Main Service Block */}
            <div className="border border-gray-300 rounded-md bg-white p-4 grid grid-cols-3 gap-4 items-center">
              {/* Service Image */}
              <div className="flex justify-center">
                <img
                  src={
                    serviceData?.service_image
                      ? `${SERVICE_IMAGE_URL}/${serviceData.service_image}`
                      : NO_IMAGE_URL
                  }
                  alt="Service"
                  className="w-40 h-40 object-cover rounded-md border"
                />
              </div>
              <div className="col-span-2 w-full">
                <div className="overflow-x-auto border border-gray-400 rounded bg-white">
                  <table className="min-w-full text-[14px] border border-gray-400 rounded bg-white">
                    <thead>
                      <tr>
                        <th className="border-b border-r border-gray-400 bg-gray-100 text-gray-900 font-bold text-center py-2">
                          Image
                        </th>
                        <th className="border-b border-r border-gray-400 bg-gray-100 text-gray-900 font-bold text-center py-2">
                          Service Sub
                        </th>
                        <th className="border-b border-gray-400 bg-gray-100 text-gray-900 font-bold text-center py-2">
                          Status
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {servicesubData.length > 0 ? (
                        servicesubData.map((item) => (
                          <tr key={item.id} className="text-[12px]">
                            <td className="border-b border-r border-gray-400 bg-white text-center align-middle">
                              <img
                                src={
                                  item?.service_sub_image
                                    ? `${SERVICE_SUB_IMAGE_URL}/${item.service_sub_image}`
                                    : NO_IMAGE_URL
                                }
                                alt="Service"
                                className="w-10 h-10 object-cover rounded border mx-auto"
                              />
                            </td>

                            <td className="border-b border-r border-gray-400 bg-white  text-black font-medium p-2">
                              {item.service_sub}
                            </td>
                            <td className="border-b border-gray-400 bg-white text-center text-black font-medium py-2">
                              {item.service_sub_status}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={3}
                            className="text-center text-gray-500 py-3 border-b border-gray-300"
                          >
                            No service sub data
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ViewSuperServiceMaster;

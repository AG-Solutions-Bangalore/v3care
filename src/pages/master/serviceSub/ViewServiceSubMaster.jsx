import axios from "axios";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { BASE_URL } from "../../../base/BaseUrl";
import ButtonConfigColor from "../../../components/common/ButtonConfig/ButtonConfigColor";
import LoaderComponent from "../../../components/common/LoaderComponent";
import PageHeader from "../../../components/common/PageHeader/PageHeader";
import Layout from "../../../layout/Layout";

const ViewServiceSubMaster = () => {
  const [serviceData, setServiceData] = useState({});
  const [servicesubData, setServiceSubData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const containerRef = useRef();
  const { id } = useParams();
  const [selectedBranch, setSelectedBranch] = useState("All");
  const [selectedPriceFor, setSelectedPriceFor] = useState("All");

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-service-sub-view-by-id/${id}`,

          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setServiceData(response?.data?.servicesub || {});
        setServiceSubData(response?.data?.serviceprice || []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchBookingData();
  }, [id]);

  const groupedServices = (servicesubData || [])
    .filter((item) => item && typeof item === "object" && item.branch_name)
    .reduce((acc, curr) => {
      if (!acc[curr.branch_name]) {
        acc[curr.branch_name] = [];
      }
      acc[curr.branch_name].push(curr);
      return acc;
    }, {});
  const branchOptions = ["All", ...Object.keys(groupedServices)];

  const priceForOptions = [
    "All",
    ...new Set(
      Object.values(groupedServices)
        .flat()
        .map((item) => item.service_price_for)
    ),
  ];
  const filteredGroupedServices = useMemo(() => {
    const filtered = {};

    Object.entries(groupedServices).forEach(([branch, services]) => {
      if (selectedBranch !== "All" && branch !== selectedBranch) return;

      const filteredServices =
        selectedPriceFor === "All"
          ? services
          : services.filter(
              (item) => item.service_price_for === selectedPriceFor
            );

      if (filteredServices.length > 0) {
        filtered[branch] = filteredServices;
      }
    });

    return filtered;
  }, [groupedServices, selectedBranch, selectedPriceFor]);

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
          title={"View Service Sub"}
          label2={
            <div className="flex justify-between items-center">
              <div className="flex space-x-4 items-end">
                <div className="flex flex-col text-sm">
                  <label
                    htmlFor="branchSelect"
                    className="mb-1 font-medium text-gray-700"
                  >
                    Branch
                  </label>
                  <select
                    id="branchSelect"
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-1"
                  >
                    {branchOptions.map((branch) => (
                      <option key={branch} value={branch}>
                        {branch}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col text-sm">
                  <label
                    htmlFor="priceForSelect"
                    className="mb-1 font-medium text-gray-700"
                  >
                    Price For
                  </label>
                  <select
                    id="priceForSelect"
                    value={selectedPriceFor}
                    onChange={(e) => setSelectedPriceFor(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-1"
                  >
                    {priceForOptions.map((pf) => (
                      <option key={pf} value={pf}>
                        {pf}
                      </option>
                    ))}
                  </select>
                </div>
                <ButtonConfigColor
                  type="print"
                  label="Print"
                  onClick={handlePrintPdf}
                />
              </div>
            </div>
          }
        />

        <div
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-300 mt-2"
          ref={containerRef}
        >
          <div className="mb-4 ">
            <h2 className="text-md font-semibold text-center mb-4 hidden print:block ">
              SERVICE SUB REPORT
            </h2>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-md font-semibold text-gray-800">
                {serviceData?.service_sub}{" "}
              </h2>
              <span className="text-sm font-bold text-gray-800">
                {serviceData?.service_sub_status}
              </span>
            </div>

            {Object.keys(filteredGroupedServices).length > 0 ? (
              Object.entries(filteredGroupedServices).map(
                ([branchName, rows]) => (
                  <div
                    key={branchName}
                    className="my-4 border border-gray-300 rounded-md p-4 shadow-sm"
                  >
                    <h2 className="text-lg font-semibold text-blue-600 mb-4">
                      {branchName}
                    </h2>
                    <div className="overflow-x-auto border border-gray-400 rounded bg-white mt-4">
                      <table className="min-w-full text-[14px]">
                        <thead>
                          <tr>
                            <th className="border-b border-r border-gray-400 bg-gray-100 text-gray-900 font-bold text-center py-2">
                              Price For
                            </th>
                            <th className="border-b border-r border-gray-400 bg-gray-100 text-gray-900 font-bold text-center py-2">
                              Original
                            </th>
                            <th className="border-b border-r border-gray-400 bg-gray-100 text-gray-900 font-bold text-center py-2">
                              Discount
                            </th>
                            <th className="border-b border-r border-gray-400 bg-gray-100 text-gray-900 font-bold text-center py-2">
                              Holiday
                            </th>
                            <th className="border-b border-r border-gray-400 bg-gray-100 text-gray-900 font-bold text-center py-2">
                              Weekend
                            </th>
                            <th className="border-b border-gray-400 bg-gray-100 text-gray-900 font-bold text-center py-2">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {rows.map((item) => (
                            <tr key={item.id} className="text-[12px]">
                              <td className="border-b border-r border-gray-400 bg-white text-black font-medium p-2">
                                {item.service_price_for}
                              </td>
                              <td className="border-b border-r border-gray-400 bg-white text-center text-black font-medium py-2">
                                {item.service_price_rate}
                              </td>
                              <td className="border-b border-r border-gray-400 bg-white text-center text-black font-medium py-2">
                                {item.service_price_amount}
                              </td>
                              <td className="border-b border-r border-gray-400 bg-white text-center text-black font-medium py-2">
                                {item.service_holiday_amount}
                              </td>
                              <td className="border-b border-r border-gray-400 bg-white text-center text-black font-medium py-2">
                                {item.service_weekend_amount}
                              </td>
                              <td className="border-b border-gray-400 bg-white text-center text-black font-medium py-2">
                                {item.service_price_status}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )
              )
            ) : (
              <div className="text-center text-gray-500 py-4">
                No data available
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ViewServiceSubMaster;

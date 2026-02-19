import html2pdf from "html2pdf.js";
import { Globe, Mail, Phone, Printer } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FaRegFilePdf } from "react-icons/fa";
import ReactToPrint from "react-to-print";
import stamplogo from "../../../public/stamplogo.png";
import logo from "../../../public/v3.png";
import Layout from "../../layout/Layout";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { BASE_URL } from "../../base/BaseUrl";
import { toWords } from "number-to-words";
import PageHeader from "../../components/common/PageHeader/PageHeader";

const QuatationView = () => {
  const containerRef = useRef();
  const { id } = useParams();
  const [formData, setFormData] = useState({});
  const token = localStorage.getItem("token");
  const fetchBooking = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-quotation-by-id/${id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setFormData(response.data);
    } catch (err) {
      toast.error("Failed to load booking");
    }
  };
  useEffect(() => {
    fetchBooking();
  }, [id]);
  const handleSaveAsPdf = () => {
    const element = containerRef.current;

    const images = element.getElementsByTagName("img");
    let loadedImages = 0;

    if (images.length === 0) {
      generatePdf(element);
      return;
    }

    Array.from(images).forEach((img) => {
      if (img.complete) {
        loadedImages++;
        if (loadedImages === images.length) {
          generatePdf(element);
        }
      } else {
        img.onload = () => {
          loadedImages++;
          if (loadedImages === images.length) {
            generatePdf(element);
          }
        };
      }
    });
  };

  const generatePdf = (element) => {
    const options = {
      margin: [0, 0, 0, 0],
      filename: "Quatation.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        windowHeight: element.scrollHeight,
        scrollY: 0,
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      },
      pagebreak: { mode: "avoid" },
    };

    html2pdf()
      .from(element)
      .set(options)
      .toPdf()
      .get("pdf")
      .then(() => {})
      .save();
  };
  const quotation = formData?.quotation || [];
  const quotationSub = formData?.quotationSub || [];
  const subTotal = quotationSub.reduce(
    (sum, item) => sum + Number(item?.quotationSub_amount || 0),
    0,
  );

  const amountInWords =
    toWords(Math.round(subTotal)).replace(/\b\w/g, (c) => c.toUpperCase()) +
    " Rupees Only";
  return (
    <Layout>
      <div className="relative">
        <PageHeader
          title="Quotation View"
          label2={
            <div className="flex gap-2">
              <button
                onClick={handleSaveAsPdf}
                className=" bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 flex items-center"
              >
                <FaRegFilePdf className="w-4 h-4 mr-2" />
                Save as PDF
              </button>

              <ReactToPrint
                trigger={() => (
                  <button className=" bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 flex items-center">
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </button>
                )}
                content={() => containerRef.current}
                documentTitle="Quatation"
                //   pageStyle={`
                //     @page {
                //         size: auto;
                //         margin: 0mm;
                //     }
                //     @media print {
                //         body {

                //              min-height:100vh
                //         }

                //     .page-break {
                //           page-break-before: always;
                //                }

                //     }
                // `}
                pageStyle={`
  @page {
    size: A4;
    margin: 0mm;
  }

  @media print {
    body {
      margin: 0;
      -webkit-print-color-adjust: exact;
    }

    table {
      page-break-inside: avoid;
    }

    tr {
      page-break-inside: avoid;
    }
  }
`}
              />
            </div>
          }
        />

        <div
          ref={containerRef}
          className="font-normal text-sm mt-4 bg-white rounded-lg"
        >
          <>
            <div className=" p-4 m-[1rem] ">
              <div className="relative max-w-4xl mx-auto border-2 border-black">
                <div className="absolute top-[2px] right-2 text-right text-xs">
                  <p className="font-semibold">PAN No: BVHPK7881A</p>
                  <p className="font-semibold">GST No: 29AAQFG1234A1Z5</p>
                </div>
                <div className=" grid grid-cols-1 sm:grid-cols-12 gap-4 my-4">
                  <div className="sm:col-span-3 flex justify-center">
                    <img
                      src={logo}
                      alt="V3care"
                      className="w-full max-w-[140px] h-auto"
                    />
                  </div>
                  <div className="sm:col-span-9 flex flex-col items-center justify-center text-center">
                    <p></p>
                    <h2 className="text-xl font-semibold mb-2">V3care</h2>
                    <p className="font-bold text-sm">
                      # 2296, 24th Main Road, 16th Cross, HSR Layout, Sector 1,
                      Bangalore – 560 102
                    </p>

                    <div className="flex items-center justify-between gap-6 text-sm mt-2">
                      <p className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        9789865436
                      </p>
                      <p className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        v3care@gmail.com
                      </p>
                      <p className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        <a
                          href="https://v3care.in/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          v3care.in
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-300 text-lg flex justify-center font-bold  border-y border-black ">
                  <h1 className="my-2">Quotation</h1>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-11 gap-4 mt-2">
                  <div className="sm:col-span-5  pr-4">
                    <p className=" px-2">
                      <span className="font-bold">Customer Name:</span>{" "}
                      {quotation?.quotation_customer || ""}
                    </p>
                    <p className="px-2">
                      {" "}
                      <span className="font-bold">Phone:</span>{" "}
                      {quotation?.quotation_customer_mobile || ""}
                    </p>
                  </div>

                  <div className="sm:col-span-6 pl-4">
                    <p> {quotation?.quotation_customer_address || ""}</p>
                  </div>
                </div>

                <div className="mt-2">
                  <table className="w-full border-t border-black text-sm">
                    <thead className="bg-blue-300">
                      <tr className="border-b border-black">
                        <th className="w-16 border-r border-black p-2 text-left">
                          S. No
                        </th>
                        <th className="w-64 border-r border-black p-2 text-left">
                          Description of Service
                        </th>
                        <th className="w-32 border-r border-black p-2 text-center">
                          Rate
                        </th>
                        <th className="w-24 border-r border-black p-2 text-center">
                          Quantity
                        </th>

                        <th className="w-32 p-2 text-center">Cost</th>
                      </tr>
                    </thead>

                    <tbody className="text-[12px]">
                      {quotationSub?.map((item, index) => (
                        <tr className="border-b border-black">
                          <td className="border-r border-black p-2 text-left">
                            {index + 1}
                          </td>
                          <td className="border-r border-black p-2">
                            {item?.quotationSub_heading ?? ""}
                            <div>
                              <span className="text-[10px]">
                                {item?.quotationSub_description ?? ""}
                              </span>
                            </div>
                          </td>

                          <td className="border-r border-black p-2 text-end">
                            {item?.quotationSub_rate ?? ""}
                          </td>
                          <td className="border-r border-black p-2 text-center">
                            {item?.quotationSub_qnty ?? ""}
                          </td>
                          <td className="p-2 text-end">
                            ₹ {item?.quotationSub_amount ?? ""}
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td colSpan={3} className="p-2">
                          <span className="font-bold">Amount in Words: </span>
                          {amountInWords}
                        </td>
                        <td className="p-2 border-b border-black border-l text-end font-bold">
                          Total
                        </td>
                        <td className="p-2 text-end font-bold border-b border-l border-black">
                          ₹ {subTotal}
                        </td>
                      </tr>

                      <tr>
                        <td colSpan={3} className="p-2">
                          <h2 className="font-bold underline">
                            Terms & Conditions:
                          </h2>
                          <p className="px-1">
                            <span className="font-bold">**</span> All the
                            Chemicals and Machines will be provided by Our
                            Company.
                          </p>
                        </td>
                        {/* <td className="p-2 border-l border-b border-black text-end font-bold">
                          GST - 18%
                        </td> */}
                        {/* <td className="p-2 text-end border-l border-b border-black">
                          2,700.00
                        </td> */}
                      </tr>

                      <tr>
                        <td colSpan={3} className="border-b border-black p-1">
                          <p className="px-1">
                            <span className="font-bold">**</span> 50% at the
                            start of the work and Balance after completion of
                            Service.
                          </p>
                        </td>
                        <td className="p-2 text-end font-bold border-b  border-black">
                          {/* Grand Total */}
                        </td>
                        <td className="p-2 text-end font-bold border-b  border-black">
                          {/* 17,700.00 */}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-2">
                    <p className="font-bold underline">Bank Details :</p>
                    <p>V3Care</p>
                    <p>A/c No : 50200012354428</p>
                    <p>IFSC CODE : HDFC0003758</p>
                  </div>

                  <div className="relative flex flex-col items-center ml-16">
                    <div className="absolute bottom-5 right-[4.5rem] text-center px-2 z-0">
                      <h2 className="p-1">Your Truly,</h2>
                      <h2 className="p-1 font-semibold ">V3care</h2>
                    </div>

                    <img
                      src={stamplogo}
                      alt="V3care"
                      className="w-full max-w-[120px] h-auto relative z-10"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="page-break"></div>
          </>
        </div>
      </div>
    </Layout>
  );
};

export default QuatationView;

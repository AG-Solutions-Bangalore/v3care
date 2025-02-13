import React, { useEffect, useRef, useState } from "react";
import { FileText, Globe, Loader2, Mail, Phone, Printer } from "lucide-react";
import html2pdf from "html2pdf.js";
import ReactToPrint from "react-to-print";
import moment from "moment";
import { FaRegFileWord } from "react-icons/fa";
import { FaRegFilePdf } from "react-icons/fa";
import logo from "../../../public/v3.png";
import stamplogo from "../../../public/stamplogo.png";
import Layout from "../../layout/Layout";
const QuatationReport = () => {
  const containerRef = useRef();

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
      .then((pdf) => {})
      .save();
  };

  return (
    <Layout>
      <div className="relative">
        <button
          onClick={handleSaveAsPdf}
          className="fixed top-20 right-36 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 flex items-center"
        >
          <FaRegFilePdf className="w-4 h-4 mr-2" />
          Save as PDF
        </button>

        <ReactToPrint
          trigger={() => (
            <button className="fixed top-20 right-10 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 flex items-center">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </button>
          )}
          content={() => containerRef.current}
          documentTitle="Quatation"
          pageStyle={`
            @page {
                size: auto;
                margin: 0mm;
            }
            @media print {
                body {
              
                     min-height:100vh
                }
            
            .page-break {
                  page-break-before: always;
                       }

            }
        `}
        />

        <div ref={containerRef} className="font-normal text-sm mt-10 ">
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
                      <span className="font-bold">Customer Name:</span> Balram
                    </p>
                    <p className="px-2">
                      {" "}
                      <span className="font-bold">Phone:</span>72591 92444
                    </p>
                  </div>

                  <div className="sm:col-span-6 pl-4">
                    <p>AUSA Medical Devices Pvt Ltd Bommasandra</p>
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
                        <th className="w-24 border-r border-black p-2 text-center">
                          Quantity
                        </th>
                        <th className="w-32 border-r border-black p-2 text-center">
                          Unit Price (Per Sft)
                        </th>
                        <th className="w-32 p-2 text-center">Cost</th>
                      </tr>
                    </thead>

                    <tbody className="text-[12px]">
                      <tr className="border-b border-black">
                        <td className="border-r border-black p-2 text-left">
                          1
                        </td>
                        <td className="border-r border-black p-2">
                          Ladies bathroom ( 8 toilets + 2 wash besan )
                        </td>
                        <td className="border-r border-black p-2 text-center">
                          10
                        </td>
                        <td className="border-r border-black p-2 text-end">
                          ₹5.00
                        </td>
                        <td className="p-2 text-end">₹50.00</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="border-r border-black p-2 text-left">
                          2
                        </td>
                        <td className="border-r border-black p-2">
                          Ladies bathroom ( 8 toilets + 2 wash besan )
                        </td>
                        <td className="border-r border-black p-2 text-center">
                          10
                        </td>
                        <td className="border-r border-black p-2 text-end">
                          ₹5.00
                        </td>
                        <td className="p-2 text-end">₹50.00</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="border-r border-black p-2 text-left">
                          3
                        </td>
                        <td className="border-r border-black p-2">
                          Ladies bathroom ( 8 toilets + 2 wash besan )
                        </td>
                        <td className="border-r border-black p-2 text-center">
                          10
                        </td>
                        <td className="border-r border-black p-2 text-end">
                          ₹5.00
                        </td>
                        <td className="p-2 text-end">₹50.00</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="border-r border-black p-2 text-left">
                          4
                        </td>
                        <td className="border-r border-black p-2">
                          Ladies bathroom ( 8 toilets + 2 wash besan )
                        </td>
                        <td className="border-r border-black p-2 text-center">
                          10
                        </td>
                        <td className="border-r border-black p-2 text-end">
                          ₹5.00
                        </td>
                        <td className="p-2 text-end">₹50.00</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="border-r border-black p-2 text-left">
                          5
                        </td>
                        <td className="border-r border-black p-2">
                          Gents bathroom 2 toilets + 2 urinals + 1 wash basin
                        </td>
                        <td className="border-r border-black p-2 text-center">
                          10
                        </td>
                        <td className="border-r border-black p-2 text-end">
                          ₹5.00
                        </td>
                        <td className="p-2 text-end">₹50.00</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="border-r border-black p-2 text-left">
                          6
                        </td>
                        <td className="border-r border-black p-2">
                          Gents bathrooom 3 urinals + 2 wash besan + 7 toilets +
                          floor
                        </td>
                        <td className="border-r border-black p-2 text-center">
                          10
                        </td>
                        <td className="border-r border-black p-2 text-end">
                          ₹5.00
                        </td>
                        <td className="p-2 text-end">₹50.00</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="border-r border-black p-2 text-left">
                          7
                        </td>
                        <td className="border-r border-black p-2">
                          Gents bathrooom 3 urinals + 2 wash besan + 7 toilets +
                          floor
                        </td>
                        <td className="border-r border-black p-2 text-center">
                          10
                        </td>
                        <td className="border-r border-black p-2 text-end">
                          ₹5.00
                        </td>
                        <td className="p-2 text-end">₹50.00</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="border-r border-black p-2 text-left">
                          8
                        </td>
                        <td className="border-r border-black p-2">
                          Gents bathrooom 3 urinals + 2 wash besan + 7 toilets +
                          floor
                        </td>
                        <td className="border-r border-black p-2 text-center">
                          10
                        </td>
                        <td className="border-r border-black p-2 text-end">
                          ₹5.00
                        </td>
                        <td className="p-2 text-end">₹50.00</td>
                      </tr>

                      <tr>
                        <td colSpan={3} className="p-2">
                          <span className="font-bold">Amount in Words: </span>
                          Twenty Nine Thousand Nine Hundred Ninety-Nine
                          Forty-One Rupees
                        </td>
                        <td className="p-2 border-b border-black border-l text-end font-bold">
                          Total
                        </td>
                        <td className="p-2 text-end font-bold border-b border-l border-black">
                          15,000.00
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
                        <td className="p-2 border-l border-b border-black text-end font-bold">
                          GST - 18%
                        </td>
                        <td className="p-2 text-end border-l border-b border-black">
                          2,700.00
                        </td>
                      </tr>

                      <tr>
                        <td colSpan={3} className="border-b border-black p-1">
                          <p className="px-1">
                            <span className="font-bold">**</span> 50% at the
                            start of the work and Balance after completion of
                            Service.
                          </p>
                        </td>
                        <td className="p-2 text-end font-bold border-b border-l border-black">
                          Grand Total
                        </td>
                        <td className="p-2 text-end font-bold border-b border-l border-black">
                          17,700.00
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

export default QuatationReport;

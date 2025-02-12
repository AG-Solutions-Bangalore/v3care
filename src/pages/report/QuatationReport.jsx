import React, { useEffect, useRef, useState } from "react";
import { FileText, Loader2, Printer } from "lucide-react";
import html2pdf from "html2pdf.js";
import ReactToPrint from "react-to-print";
import moment from "moment";
import { FaRegFileWord } from "react-icons/fa";
import { FaRegFilePdf } from "react-icons/fa";
import logo from "../../../public/v3.png";
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
      filename: "Invoice_Packing.pdf",
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
      .then((pdf) => {
        const totalPages = pdf.internal.getNumberOfPages();
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        console.log(`Element Height: ${element.scrollHeight}`);
        console.log(`Page Width: ${pageWidth}, Page Height: ${pageHeight}`);

        for (let i = 1; i <= totalPages; i++) {
          pdf.setPage(i);
          pdf.setFontSize(10);
          pdf.setTextColor(0, 0, 0);
          const text = `Page ${i} of ${totalPages}`;
          const textWidth =
            (pdf.getStringUnitWidth(text) * 10) / pdf.internal.scaleFactor;
          const x = pageWidth - textWidth - 10;
          const y = pageHeight - 10;
          pdf.text(text, x, y);
        }
      })
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
          documentTitle="contract-view"
          pageStyle={`
            @page {
              size: auto;
              margin: 0mm;
            }
            @media print {
              body {
                min-height: 100vh;
              }
              .print-hide {
                display: none;
              }
              .page-break {
                page-break-before: always;
              }
            }
          `}
        />

        <div ref={containerRef} className="font-normal text-sm mt-10 ">
          <div className=" p-6 m-[3rem]">
            <div className="max-w-4xl mx-auto border border-black">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 my-4">
                <div className="sm:col-span-8 flex flex-col items-center justify-center text-center">
                  <h2 className="text-xl font-semibold mb-2">V3care</h2>
                  <p className="font-bold text-md">
                    # 2296, 24th Main Road, 16th Cross, <br />
                    HSR Layout, Sector 1, <br />
                    Bangalore – 560 102
                  </p>
                </div>

                <div className="sm:col-span-4 flex justify-end">
                  <img
                    src={logo}
                    alt="V3care"
                    className="w-full max-w-[150px] h-auto"
                  />
                </div>
              </div>
              <div className="bg-blue-300 text-lg flex justify-center font-bold  border-y border-black ">
                <h1 className="my-2">Quotation</h1>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-11 gap-4 my-2">
                <div className="sm:col-span-5  pr-4">
                  <div className="grid grid-cols-2 gap-2">
                    <p className="font-bold text-md flex justify-center">
                      Balram
                    </p>
                    <p className="text-gray-700">72591 92444</p>
                  </div>
                </div>

                <div className="sm:col-span-6 pl-4">
                  <p className="text-md">
                    AUSA Medical Devices Pvt Ltd Bommasandra
                  </p>
                </div>
              </div>
              <div className=" flex justify-center my-4 text-sm">
                <h1>https://maps.app.goo.gl/i2TsrXbdxjgbCZaz8%22</h1>
              </div>

              <div className="mt-6">
                <table className="w-full border-t border-black text-sm">
                  {/* Table Header */}
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

                  {/* Table Body */}
                  <tbody>
                    <tr className="border-b border-black">
                      <td className="border-r border-black p-2 text-left">1</td>
                      <td className="border-r border-black p-2">
                        Ladies bathroom ( 8 toilets + 2 wash besan )
                      </td>
                      <td className="border-r border-black p-2 text-center">
                        10
                      </td>
                      <td className="border-r border-black p-2 text-center">
                        $5.00
                      </td>
                      <td className="p-2 text-center">$50.00</td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="border-r border-black p-2 text-left">2</td>
                      <td className="border-r border-black p-2">
                        Gents bathroom 2 toilets + 2 urinals + 1 wash basin
                      </td>
                      <td className="border-r border-black p-2 text-center">
                        10
                      </td>
                      <td className="border-r border-black p-2 text-center">
                        $5.00
                      </td>
                      <td className="p-2 text-center">$50.00</td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="border-r border-black p-2 text-left">3</td>
                      <td className="border-r border-black p-2">
                        Gents bathrooom 3 urinals + 2 wash besan + 7 toilets +
                        floor
                      </td>
                      <td className="border-r border-black p-2 text-center">
                        10
                      </td>
                      <td className="border-r border-black p-2 text-center">
                        $5.00
                      </td>
                      <td className="p-2 text-center">$50.00</td>
                    </tr>
                    {/* // */}
                    <tr className="border-b border-black">
                      <td className="border-r border-black p-2 text-left"></td>
                      <td className="border-r border-black p-2 font-bold">
                        All the Chemicals and Machines will be provided by Our
                        Company
                      </td>
                      <td className="border-r border-black p-2 text-center"></td>
                      <td className="border-r border-black p-2 text-center"></td>
                      <td className="p-2 text-center"></td>
                    </tr>
                    {/* //total */}
                    <tr>
                      <td></td>
                      <td></td>
                      <td className="border-l border-black"></td>
                      <td className="p-2">Total</td>
                      <td className="p-2 text-end font-bold border-b border-l border-black">
                        15,000.00
                      </td>
                    </tr>
                    {/* //down gst */}
                    <tr>
                      <td></td>
                      <td></td>
                      <td className="border-l border-black p-2">GST - 18%</td>
                      <td></td>
                      <td className="p-2 text-end ">2,700.00</td>
                    </tr>
                    {/* //down gst */}
                    <tr>
                      <td colSpan={2} className="p-2">
                        Terms & Conditions:
                      </td>
                      <td className="p-2 text-start font-bold border-b border-l border-black">
                        Total
                      </td>

                      <td className="p-2 text-end font-bold border-b border-black"></td>
                      <td className="p-2 text-end font-bold border-b border-black">
                        17,700.00
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div>
                <h2 className="p-2">
                  Payment : 50% at the start of the work and Balance After
                  completion of Service
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-2">
                  <p className="font-bold underline">Company Details:</p>
                  <p>PAN NO. BVHPK7881A</p>
                </div>

                <div>
                  <p className="font-bold underline">Bank Details :</p>
                  <p>V3Care</p>
                  <p>A/c No : 50200012354428,</p>
                  <p>IFSC CODE : HDFC0003758</p>
                </div>
              </div>

              <div className="h-[100px]"></div>
              <div>
                <h2 className="p-2">Your truly,</h2>
                <h2 className="p-2">V3care</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default QuatationReport;

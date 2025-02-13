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
import RepoortFilter from "../../components/ReportFilter";
const TaxInvoice = () => {
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
      <RepoortFilter />
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
            <div className=" p-4 m-[1rem] font-normal text-[12px]">
              <div className=" max-w-4xl mx-auto border-2 border-black">
                <div className=" grid grid-cols-2 gap-2 my-1">
                  <div className="grid grid-cols-12">
                    <div className="col-span-3 flex justify-center items-center">
                      <img
                        src={logo}
                        alt="V3care"
                        className="w-full max-w-[140px] h-auto"
                      />
                    </div>

                    <div className="col-span-9">
                      <p className="text-sm leading-relaxed">
                        <strong>V3 CARE</strong> <br />
                        D.No-287, Gaurav Villa, 5th Main Road, 15th Cross,{" "}
                        <br />
                        HSR Layout, Sector-6, Bangalore <br />
                        <strong>GSTIN/UIN:</strong> 29BVHPK7881A1ZB <br />
                        <strong>State Name:</strong> Karnataka,{" "}
                        <strong>Code:</strong> 29 <br />
                        <strong>Email:</strong> info@v3care.in
                      </p>
                    </div>
                  </div>
                  {/* <div className="grid grid-rows-3 gap-2 my-1">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-semibold">Invoice No.</h3>
                        <p>V3C/G155/24-25</p>
                      </div>
                      <div>
                        <h3 className="font-semibold">Dated</h3>
                        <p>5-Aug-24</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-semibold">Delivery Note</h3>
                        <p></p>
                      </div>
                      <div>
                        <h3 className="font-semibold">Mode/Terms of Payment</h3>
                        <p></p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-semibold">Reference No. & Date.</h3>
                        <p></p>
                      </div>
                      <div>
                        <h3 className="font-semibold">Other References</h3>
                        <p></p>
                      </div>
                    </div>
                  </div> */}
                  <div className="grid grid-rows-3 gap-2">
                    {/* Row 1 */}
                    <div className="grid grid-cols-2  border-b border-l border-black">
                      <div>
                        <h3>Invoice No.</h3>
                        <p className="font-semibold text-black">
                          V3C/G155/24-25
                        </p>
                      </div>
                      <div>
                        <h3>Dated</h3>
                        <p className="font-semibold text-black">5-Aug-24</p>
                      </div>
                    </div>

                    {/* Row 2 */}
                    <div className="grid grid-cols-2  border-b border-l border-black ">
                      <div>
                        <h3>Delivery Note</h3>
                        <p></p>
                      </div>
                      <div>
                        <h3>Mode/Terms of Payment</h3>
                        <p></p>
                      </div>
                    </div>

                    {/* Row 3 */}
                    <div className="grid grid-cols-2 border-l border-black">
                      <div>
                        <h3>Reference No. & Date.</h3>
                        <p></p>
                      </div>
                      <div>
                        <h3>Other References</h3>
                        <p></p>
                      </div>
                    </div>
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

export default TaxInvoice;
{
  {
    /* <tr className="border-b border-black bg-gray-200">
                      <th className="border-r border-black px-2 py-1 text-center align-bottom">
                        HSN/SAC
                      </th>
                      <th className="border-r border-black px-2 py-1 text-center align-bottom">
                        Taxable Value
                      </th>

                      <th
                        colSpan="2"
                        className="border-r border-black text-center relative"
                      >
                        Central Tax
                        <div className="border-t border-black mt-1 flex justify-center text-xs font-normal">
                          <span className="border-r border-black px-2 w-14">
                            Rate
                          </span>
                          <span className="px-2 w-14">Amount</span>
                        </div>
                      </th>

                      <th
                        colSpan="2"
                        className="border-r border-black text-center relative"
                      >
                        State Tax
                        <div className="border-t border-black mt-1 flex justify-center text-xs font-normal">
                          <span className="border-r border-black px-2 w-14">
                            Rate
                          </span>
                          <span className="px-2 w-14">Amount</span>
                        </div>
                      </th>

                      <th className="px-2 py-1 text-center align-bottom">
                        Total Tax Amount
                      </th>
                    </tr> */
  }
}

{
  /* <tr className="border-b border-black bg-gray-200">
                      <th className="border-r border-black px-2 py-1 text-center align-bottom">
                        HSN/SAC
                      </th>
                      <th className="border-r border-black px-2 py-1 text-center align-bottom">
                        Taxable Value
                      </th>

                      <th
                        colSpan="2"
                        className="border-r border-black text-center relative"
                      >
                        Central Tax
                        <div className="border-t border-black mt-1 flex justify-center text-xs font-normal">
                          <span className="border-r border-black px-2 w-14">
                            Rate
                          </span>
                          <span className="px-2 w-14">Amount</span>
                        </div>
                      </th>

                      <th
                        colSpan="2"
                        className="border-r border-black text-center relative"
                      >
                        State Tax
                        <div className="border-t border-black mt-1 flex justify-center text-xs font-normal">
                          <span className="border-r border-black px-2 w-14">
                            Rate
                          </span>
                          <span className="px-2 w-14">Amount</span>
                        </div>
                      </th>

                      <th className="px-2 py-1 text-center align-bottom">
                        Total Tax Amount
                      </th>
                    </tr> */
}

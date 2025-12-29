import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { MenuItem, TextField } from "@mui/material";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { useReactToPrint } from 'react-to-print';
import * as ExcelJS from 'exceljs';
import moment from 'moment';
import ButtonConfigColor from '../../../components/common/ButtonConfig/ButtonConfigColor';
import PageHeader from '../../../components/common/PageHeader/PageHeader';
import LoaderComponent from '../../../components/common/LoaderComponent';
import Layout from '../../../layout/Layout';
import { BASE_URL } from '../../../base/BaseUrl';

const VendorSummaryForm = () => {
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState('');
  const [bookingData, setBookingData] = useState([]);
  const [fetchingVendors, setFetchingVendors] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  const tableRef = useRef();

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-vendor-report`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        if (response.data && response.data.vendor) {
          setVendors(response.data.vendor);
        }
      } catch (err) {
        console.error('Error fetching vendors:', err);
        setError('Failed to load vendors. Please try again.');
      } finally {
        setFetchingVendors(false);
      }
    };

    fetchVendors();
  }, []);

  const handleVendorChange = (e) => {
    setSelectedVendor(e.target.value);
    setBookingData([]); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}/api/panel-fetch-vendor-payment-report`,
        {
          vendor_id: selectedVendor,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.booking) {
        setBookingData(response.data.booking);
      } else {
        setBookingData([]);
      }
    } catch (err) {
      console.error('Error fetching vendor payment report:', err);
      setError('Failed to fetch vendor payment report. Please try again.');
      setBookingData([]);
    } finally {
      setSubmitting(false);
    }
  };

  const getVendorName = () => {
    const vendor = vendors.find(v => v.vendor_id.toString() === selectedVendor);
    return vendor ? vendor.name : 'Selected Vendor';
  };

  const handlePrint = useReactToPrint({
    content: () => tableRef.current,
    documentTitle: `Vendor-Summary-Report-${getVendorName()}-${moment().format('YYYY-MM-DD')}`,
    pageStyle: `
      @page {
        size: A4 landscape;
        margin: 10mm;
      }
      @media print {
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
          height: 100% !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        body * {
          visibility: hidden;
        }
        
        .printable-content, .printable-content * {
          visibility: visible;
        }
        
        .printable-content {
          position: absolute;
          left: 0;
          top: 0;
          width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        
        table {
          width: 100% !important;
          table-layout: fixed !important;
          border-collapse: collapse !important;
        }
        
        th, td {
          padding: 4px !important;
          font-size: 9px !important;
          line-height: 1.2 !important;
          word-break: break-word !important;
          overflow-wrap: break-word !important;
        }
        
        .avoid-break {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }
      }
    `,
  });

  const handleDownloadExcel = async () => {
    if (!bookingData.length) return;

    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Vendor Summary Report');

      const title = `Vendor Payment Summary Report - ${getVendorName()}`;
      const titleRow = worksheet.addRow([title]);
      worksheet.mergeCells(`A1:G1`);
      titleRow.font = { bold: true, size: 14 };
      titleRow.alignment = { horizontal: 'center' };
      
      const subtitleRow = worksheet.addRow([`Generated on: ${moment().format('DD/MM/YYYY HH:mm:ss')}`]);
      worksheet.mergeCells(`A2:G2`);
      subtitleRow.font = { size: 10 };
      subtitleRow.alignment = { horizontal: 'center' };
      
      worksheet.addRow([]);

      const headers = [
        "Booking ID | Branch",
        "Customer | Mobile",
        "Service Date",
        "Service Details",
        "Amount Details",
        "Commission",
        "Payment Status & Transaction"
      ];

      const headerRow = worksheet.addRow(headers);
      headerRow.eachCell((cell) => {
        cell.font = { 
          bold: true, 
          color: { argb: '000000' } 
        };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF82B8A4' }
        };
        cell.alignment = { 
          horizontal: 'center',
          vertical: 'middle',
          wrapText: true 
        };
        cell.border = {
          top: { style: 'thin' },
          bottom: { style: 'thin' },
          left: { style: 'thin' },
          right: { style: 'thin' }
        };
      });

      bookingData.forEach((booking) => {
        const col1 = `${booking.order_ref}\n${booking.branch_name}`;
        const col2 = `${booking.order_customer}\n${booking.order_customer_mobile}`;
        const col3 = moment(booking.order_service_date).format('DD-MMM-YYYY');
        
        const serviceType = booking.order_service === "Custom" ? 
          `Custom: ${booking.order_custom || "-"}` : 
          booking.order_service;
        const price = booking.order_service === "Custom" ? 
          (booking.order_custom_price || booking.order_service_price) : 
          booking.order_service_price;
        const subService = booking.order_service_sub ? 
          `Sub: ${booking.order_service_sub}` : "";
        
        const col4 = `${serviceType}\n${subService}\nPrice For: ${booking.order_service_price_for}\nVendor: ${booking.vendor_company}\nPrice: ₹${price}`;
        
        const amount = parseFloat(booking.order_amount || 0);
        const advance = parseFloat(booking.order_advance || 0);
        const discount = parseFloat(booking.order_discount || 0);
        const commission = parseFloat(booking.order_comm || 0);
        
        const col5 = `Amount: ₹${amount}\nAdvance: ₹${advance}\nDiscount: ₹${discount}\nCommission: ₹${commission}`;
        
        const col6 = `Comm: ₹${commission}\nPayable: ₹${commission}\nReceivable: ₹${commission}`;
        
        const paymentType = booking.order_payment_type;
        const paymentAmount = parseFloat(booking.order_payment_amount || 0);
        const col7 = `Type: ${paymentType}\nAmount: ₹${paymentAmount}\nTransaction: ${booking.order_transaction_details || "-"}\nStatus: ${booking.order_comm_status}`;
        
        const rowData = [col1, col2, col3, col4, col5, col6, col7];
        
        const dataRow = worksheet.addRow(rowData);
        
        dataRow.eachCell((cell) => {
          cell.alignment = { 
            vertical: 'top',
            wrapText: true 
          };
        });
      });

      worksheet.addRow([]);
      
      const summaryHeaders = ["Metric", "Value"];
      const summaryHeaderRow = worksheet.addRow(summaryHeaders);
      worksheet.mergeCells(`A${summaryHeaderRow.number}:B${summaryHeaderRow.number}`);
      summaryHeaderRow.font = { bold: true };
      summaryHeaderRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE5E7EB' }
      };

      const totalAmount = bookingData.reduce((sum, item) => sum + parseFloat(item.order_amount || 0), 0);
      const totalCommission = bookingData.reduce((sum, item) => sum + parseFloat(item.order_comm || 0), 0);
      const totalPayment = bookingData.reduce((sum, item) => sum + parseFloat(item.order_payment_amount || 0), 0);
      const pendingCommission = bookingData
        .filter(item => item.order_comm_status === 'Pending')
        .reduce((sum, item) => sum + parseFloat(item.order_comm || 0), 0);

      worksheet.addRow(["Total Bookings", bookingData.length]);
      worksheet.addRow(["Total Amount", totalAmount]);
      worksheet.addRow(["Total Commission", totalCommission]);
      worksheet.addRow(["Total Payment", totalPayment]);
      worksheet.addRow(["Pending Commission", pendingCommission]);
      worksheet.addRow(["Paid Commission", totalCommission - pendingCommission]);

      for (let i = worksheet.rowCount - 5; i <= worksheet.rowCount; i++) {
        const valueCell = worksheet.getRow(i).getCell(2);
        if (i > worksheet.rowCount - 5) {
          valueCell.numFmt = '#,##0.00';
        }
      }

      worksheet.columns.forEach((column) => {
        let maxLength = 0;
        column.eachCell({ includeEmpty: true }, (cell) => {
          const columnLength = cell.value ? cell.value.toString().length : 10;
          if (columnLength > maxLength) {
            maxLength = columnLength;
          }
        });
        column.width = Math.min(maxLength + 2, 30);
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const vendorNameForFile = getVendorName().replace(/[^a-zA-Z0-9]/g, '-');
      link.download = `vendor-summary-${vendorNameForFile}-${moment().format('YYYY-MM-DD')}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Excel generation error:', error);
      setError('Failed to generate Excel file. Please try again.');
    }
  };

  if (fetchingVendors) {
    return (
      <Layout>
        <LoaderComponent />
      </Layout>
    );
  }

  return (
    <Layout>
      <PageHeader title="Vendor Summary Report" />

      <div className="bg-white shadow-md rounded-lg mt-2 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex items-center text-blue-600 mb-4 text-sm bg-blue-50 p-3 rounded-md">
            <AiOutlineInfoCircle className="mr-2 text-lg flex-shrink-0" />
            <p>
              Select a vendor to view their payment summary report. The report will show all bookings and commissions for the selected vendor.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="md:col-span-2">
              <TextField
                label="Select Vendor"
                select
                size="small"
                value={selectedVendor}
                onChange={handleVendorChange}
                variant="outlined"
                fullWidth
              >
                <MenuItem value="">
                  <em>Select a vendor</em>
                </MenuItem>
                {vendors.map((vendor) => (
                  <MenuItem key={vendor.vendor_id} value={vendor.vendor_id.toString()}>
                    {vendor.name}
                  </MenuItem>
                ))}
              </TextField>
            </div>

            <div>
              <ButtonConfigColor
                type="submit"
                label="Generate Report"
                loading={submitting}
                fullWidth
              />
            </div>
          </div>
        </form>
      </div>

      {bookingData.length > 0 && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Payment Report for: <span className="text-blue-600">{getVendorName()}</span>
              </h2>
              <div className="text-sm text-gray-600 mt-1">
                Total Bookings: {bookingData.length} | Generated: {moment().format('DD/MM/YYYY HH:mm')}
              </div>
            </div>
            
            <div className="flex space-x-2">
              <ButtonConfigColor
                type="button"
                label="Print"
                onClick={handlePrint}
                variant="outlined"
                size="small"
              />
              <ButtonConfigColor
                type="button"
                label="Excel"
                onClick={handleDownloadExcel}
                variant="outlined"
                size="small"
              />
            </div>
          </div>

          {/* Printable Content - Wrapped in a div for print styling */}
          <div ref={tableRef} className="printable-content">
            <div className="mb-6">
              <h1 className="text-xl font-bold text-center mb-2">
                Vendor Payment Summary Report - {getVendorName()}
              </h1>
              <p className="text-sm text-center text-gray-600 mb-4">
                Generated on: {moment().format('DD/MM/YYYY HH:mm:ss')} | Total Bookings: {bookingData.length}
              </p>
            </div>

            {/* Table for Print - Using table structure instead of grid */}
            <div className="overflow-x-auto hidden print:block">
              <table className="w-full border-collapse border border-gray-300 text-xs">
                <thead>
                  <tr className="bg-green-100">
                    <th className="border border-gray-300 p-2 text-center font-bold">Booking ID | Branch</th>
                    <th className="border border-gray-300 p-2 text-center font-bold">Customer | Mobile</th>
                    <th className="border border-gray-300 p-2 text-center font-bold">Service Date</th>
                    <th className="border border-gray-300 p-2 text-center font-bold">Service Details</th>
                    <th className="border border-gray-300 p-2 text-center font-bold">Amount Details</th>
                    <th className="border border-gray-300 p-2 text-center font-bold">Commission</th>
                    <th className="border border-gray-300 p-2 text-center font-bold">Payment Status & Transaction</th>
                  </tr>
                </thead>
                <tbody>
                  {bookingData.map((booking, index) => (
                    <tr key={index} className="avoid-break">
                      <td className="border border-gray-300 p-2 align-top">
                        <div className="font-medium">{booking.order_ref}</div>
                        <div className="text-gray-600">{booking.branch_name}</div>
                      </td>
                      <td className="border border-gray-300 p-2 align-top">
                        <div className="font-medium">{booking.order_customer}</div>
                        <div className="text-gray-600">{booking.order_customer_mobile}</div>
                      </td>
                      <td className="border border-gray-300 p-2 align-top">
                        <div className="font-medium">
                          {moment(booking.order_service_date).format('DD-MMM-YYYY')}
                        </div>
                      </td>
                      <td className="border border-gray-300 p-2 align-top">
                        <div className="font-medium">
                          {booking.order_service === "Custom" ? (
                            <>
                              <div>Custom: {booking.order_custom || "-"}</div>
                              {booking.order_service_sub && (
                                <div className="text-gray-600">Sub: {booking.order_service_sub}</div>
                              )}
                              <div className="mt-1">
                                <span className="text-gray-600">Price For:</span> {booking.order_service_price_for}
                              </div>
                              <div>
                                <span className="text-gray-600">Vendor:</span> {booking.vendor_company}
                              </div>
                              <div>
                                <span className="text-gray-600">Price:</span> ₹{booking.order_custom_price || booking.order_service_price}
                              </div>
                            </>
                          ) : (
                            <>
                              <div>{booking.order_service}</div>
                              {booking.order_service_sub && (
                                <div className="text-gray-600">Sub: {booking.order_service_sub}</div>
                              )}
                              <div className="mt-1">
                                <span className="text-gray-600">Price For:</span> {booking.order_service_price_for}
                              </div>
                              <div>
                                <span className="text-gray-600">Vendor:</span> {booking.vendor_company}
                              </div>
                              <div>
                                <span className="text-gray-600">Price:</span> ₹{booking.order_service_price}
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="border border-gray-300 p-2 align-top">
                        <div className="space-y-1">
                          <div>
                            <span className="text-gray-600">Amount:</span> ₹{booking.order_amount}
                          </div>
                          <div>
                            <span className="text-gray-600">Advance:</span> ₹{booking.order_advance || "0"}
                          </div>
                          <div>
                            <span className="text-gray-600">Discount:</span> ₹{booking.order_discount || "0"}
                          </div>
                          <div>
                            <span className="text-gray-600">Commission:</span> ₹{booking.order_comm || "0"}
                          </div>
                        </div>
                      </td>
                      <td className="border border-gray-300 p-2 align-top">
                        <div className="space-y-1">
                          <div>
                            <span className="text-gray-600">Comm:</span> ₹{booking.order_comm || "0"}
                          </div>
                          <div className="grid grid-cols-2 gap-1">
                            <div className="bg-blue-50 p-1 rounded">
                              <div className="text-xs text-gray-600">Payable</div>
                              <div className="font-medium">₹{booking.order_comm || "0"}</div>
                            </div>
                            <div className="bg-green-50 p-1 rounded">
                              <div className="text-xs text-gray-600">Receivable</div>
                              <div className="font-medium">₹{booking.order_comm_received_by || "0"}</div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="border border-gray-300 p-2 align-top">
                        <div className="space-y-1">
                          <div>
                            <span className="text-gray-600">Type:</span> {booking.order_payment_type}
                          </div>
                          <div>
                            <span className="text-gray-600">Amount:</span> ₹{booking.order_payment_amount}
                          </div>
                          <div>
                            <span className="text-gray-600">Transaction:</span> {booking.order_transaction_details || "-"}
                          </div>
                          <div>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              booking.order_comm_status === 'Paid' 
                                ? 'bg-green-100 text-green-800'
                                : booking.order_comm_status === 'Pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {booking.order_comm_status}
                            </span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Grid for Screen View - Hidden during print */}
            <div className="overflow-x-auto border-l border-r border-black bg-white mt-2 print:hidden">
              <div 
                className="grid bg-white text-[11px] min-w-[1600px]"
                style={{
                  gridTemplateColumns: "repeat(7, minmax(150px, 1fr))"
                }}
              >
                {[
                  "Booking ID | Branch",
                  "Customer | Mobile",
                  "Service Date",
                  "Service Details",
                  "Amount Details",
                  "Commission",
                  "Payment Status & Transaction"
                ].map((header, idx) => (
                  <div
                    key={idx}
                    className="p-2 text-center font-bold border-b border-t border-r border-black text-gray-900"
                  >
                    {header}
                  </div>
                ))}

                {bookingData.map((booking, index) => (
                  <React.Fragment key={index}>
                    <div className="p-2 border-b border-r border-black">
                      <div className="font-medium">{booking.order_ref}</div>
                      <div className="text-gray-600">{booking.branch_name}</div>
                    </div>
                    
                    <div className="p-2 border-b border-r border-black">
                      <div className="font-medium">{booking.order_customer}</div>
                      <div className="text-gray-600">{booking.order_customer_mobile}</div>
                    </div>
                    
                    <div className="p-2 border-b border-r border-black">
                      <div className="font-medium">
                        {moment(booking.order_service_date).format('DD-MMM-YYYY')}
                      </div>
                    </div>
                    
                    <div className="p-2 border-b border-r border-black">
                      <div className="font-medium">
                        {booking.order_service === "Custom" ? (
                          <>
                            <div>Custom: {booking.order_custom || "-"}</div>
                            {booking.order_service_sub && (
                              <div className="text-gray-600">Sub: {booking.order_service_sub}</div>
                            )}
                            <div className="mt-1">
                              <span className="text-gray-600">Price For:</span> {booking.order_service_price_for}
                            </div>
                            <div>
                              <span className="text-gray-600">Vendor:</span> {booking.vendor_company}
                            </div>
                            <div>
                              <span className="text-gray-600">Price:</span> ₹{booking.order_custom_price || booking.order_service_price}
                            </div>
                          </>
                        ) : (
                          <>
                            <div>{booking.order_service}</div>
                            {booking.order_service_sub && (
                              <div className="text-gray-600">Sub: {booking.order_service_sub}</div>
                            )}
                            <div className="mt-1">
                              <span className="text-gray-600">Price For:</span> {booking.order_service_price_for}
                            </div>
                            <div>
                              <span className="text-gray-600">Vendor:</span> {booking.vendor_company}
                            </div>
                            <div>
                              <span className="text-gray-600">Price:</span> ₹{booking.order_service_price}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="p-2 border-b border-r border-black">
                      <div className="space-y-1">
                        <div>
                          <span className="text-gray-600">Amount:</span> ₹{booking.order_amount}
                        </div>
                        <div>
                          <span className="text-gray-600">Advance:</span> ₹{booking.order_advance || "0"}
                        </div>
                        <div>
                          <span className="text-gray-600">Discount:</span> ₹{booking.order_discount || "0"}
                        </div>
                        <div>
                          <span className="text-gray-600">Commission:</span> ₹{booking.order_comm || "0"}
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-2 border-b border-r border-black">
                      <div className="space-y-1">
                        <div>
                          <span className="text-gray-600">Comm:</span> {booking.order_comm || "0"}
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                          <div className="bg-blue-50 p-1 rounded">
                            <div className="text-xs text-gray-600">Payable</div>
                            <div className="font-medium">₹{booking.order_comm || "0"}</div>
                          </div>
                          <div className="bg-green-50 p-1 rounded">
                            <div className="text-xs text-gray-600">Receivable</div>
                            <div className="font-medium">₹{booking.order_comm_received_by || "0"}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-2 border-b border-r border-black">
                      <div className="space-y-1">
                        <div>
                          <span className="text-gray-600">Type:</span> {booking.order_payment_type}
                        </div>
                        <div>
                          <span className="text-gray-600">Amount:</span> ₹{booking.order_payment_amount}
                        </div>
                        <div>
                          <span className="text-gray-600">Transaction:</span> {booking.order_transaction_details || "-"}
                        </div>
                        <div>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            booking.order_comm_status === 'Paid' 
                              ? 'bg-green-100 text-green-800'
                              : booking.order_comm_status === 'Pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {booking.order_comm_status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Summary Stats - Will appear at bottom of each printed page */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4 avoid-break">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="text-sm text-blue-600 font-medium">Total Amount</div>
                <div className="text-2xl font-bold text-blue-800">
                  ₹{bookingData.reduce((sum, item) => sum + parseFloat(item.order_amount || 0), 0).toFixed(2)}
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="text-sm text-green-600 font-medium">Total Commission</div>
                <div className="text-2xl font-bold text-green-800">
                  ₹{bookingData.reduce((sum, item) => sum + parseFloat(item.order_comm || 0), 0).toFixed(2)}
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <div className="text-sm text-purple-600 font-medium">Total Payment</div>
                <div className="text-2xl font-bold text-purple-800">
                  ₹{bookingData.reduce((sum, item) => sum + parseFloat(item.order_payment_amount || 0), 0).toFixed(2)}
                </div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="text-sm text-yellow-600 font-medium">Pending Commission</div>
                <div className="text-2xl font-bold text-yellow-800">
                  ₹{bookingData
                    .filter(item => item.order_comm_status === 'Pending')
                    .reduce((sum, item) => sum + parseFloat(item.order_comm || 0), 0)
                    .toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {submitting && !bookingData.length && (
        <div className="mt-6">
          <LoaderComponent />
        </div>
      )}

      {!submitting && !bookingData.length && selectedVendor && (
        <div className="mt-6 p-6 bg-gray-50 rounded-lg border border-gray-300 text-center">
          <p className="text-gray-600">No booking data found for the selected vendor.</p>
        </div>
      )}
    </Layout>
  );
};

export default VendorSummaryForm;
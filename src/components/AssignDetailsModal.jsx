// components/AssignDetailsModal.js
import React from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";

const AssignDetailsModal = ({ open, handleOpen, assignDetails }) => {
  return (
    <Dialog open={open} handler={handleOpen} size="lg">
      <DialogHeader>Assignment Details</DialogHeader>
      <DialogBody>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-blue-200">
                <th className="border border-black px-4 py-2 text-left text-black">
                  Full Name
                </th>
                <th className="border border-black px-4 py-2 text-left text-black">
                  Start Time
                </th>
                <th className="border border-black px-4 py-2 text-left text-black">
                  On the Way Time
                </th>
                <th className="border border-black px-4 py-2 text-left text-black">
                  End Time
                </th>
                <th className="border border-black px-4 py-2 text-left text-black">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {assignDetails.map((assign, index) => (
                <tr key={index}>
                  <td className="border border-black px-4 py-2">
                    {assign.user.name}
                  </td>
                  <td className="border border-black px-4 py-2">
                    {assign.order_start_time || "-"}
                  </td>
                  <td className="border border-black px-4 py-2">
                    {assign.order_way_time || "-"}
                  </td>
                  <td className="border border-black px-4 py-2">
                    {assign.order_end_time || "-"}
                  </td>
                  <td className="border border-black px-4 py-2">
                    {assign.order_assign_status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogBody>
      <DialogFooter>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => handleOpen(false)}
        >
          Close
        </button>
      </DialogFooter>
    </Dialog>
  );
};

export default AssignDetailsModal;
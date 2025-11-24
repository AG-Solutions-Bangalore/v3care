import React, { useState } from "react";
import {
  Popover,
  PopoverHandler,
  PopoverContent,
} from "@material-tailwind/react";
import { MessageSquareMore } from "lucide-react";

const CommentPopover = ({ booking }) => {
  const [openPopover, setOpenPopover] = useState(false);

  const remarks = booking?.order_remarks ?? "";
  const comment = booking?.order_comment ?? "";
  const postpone = booking?.order_postpone_reason ?? "";

  const noData = !remarks && !comment && !postpone;

  // Check if any text is long (>100 chars)
  const isLongContent =
    remarks.length > 100 || comment.length > 100 || postpone.length > 100;

  const triggers = {
    onMouseEnter: () => setOpenPopover(true),
    onMouseLeave: () => setOpenPopover(false),
  };

  return (
    <Popover
      open={openPopover}
      handler={setOpenPopover}
      placement="right-start"
    >
      <PopoverHandler {...triggers}>
        <MessageSquareMore
          className={`h-6 w-6 cursor-pointer ${
            noData
              ? "text-red-600 hover:text-red-800"
              : "text-gray-600 hover:text-blue-800"
          }`}
        />
      </PopoverHandler>

      <PopoverContent
        {...triggers}
        className={`p-4 text-sm rounded-lg shadow-md bg-white space-y-3 ${
          isLongContent ? "w-96" : "w-64"
        }`}
      >
        {noData ? (
          <p className="text-center font-semibold text-gray-500">No Data</p>
        ) : (
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            <div>
              <h4 className="font-semibold text-blue-900">Remarks</h4>
              <p className="text-gray-700 mt-1 bg-gray-100 px-2 py-1 rounded-md whitespace-pre-line">
                {remarks || "N/A"}
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-blue-900">Comment</h4>
              <p className="text-gray-700 mt-1 bg-gray-100 px-2 py-1 rounded-md whitespace-pre-line">
                {comment || "N/A"}
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-blue-900">Postpone Reason</h4>
              <p className="text-gray-700 mt-1 bg-gray-100 px-2 py-1 rounded-md whitespace-pre-line">
                {postpone || "N/A"}
              </p>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default CommentPopover;

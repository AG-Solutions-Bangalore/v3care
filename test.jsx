      <PageHeader
        title={
          <>
            Booking for{" "}
            <span className="text-[#F44336]">{booking?.order_service}</span>
          </>
        }
        label2={
          <span className="space-x-2">
            {!(
              booking.order_status === "Pending" ||
              booking.order_status === "Completed" ||
              booking.order_status === "Cancel" ||
              booking.order_status === "Vendor" ||
              vendor?.vendor_company
            ) && (
              <ButtonConfigColor
                type="create"
                label="Add Assign V3"
                onClick={() => navigate(`/booking-assign/${id}`)}
              />
            )}
            {(booking.order_status === "Confirmed" ||
              booking.order_status === "ReConfirmed" ||
              booking.order_status === "Vendor" ||
              booking.order_status === "Inspection") && (
              <ButtonConfigColor
                type="create"
                label="Assign Vendor"
                onClick={() => navigate(`/assign-vendor/${id}`)}
              />
            )}
            {(booking.order_status === "Confirmed" ||
              booking.order_status === "ReConfirmed") &&
              userType !== "4" && (
                <ButtonConfigColor
                  type="create"
                  label="Notify All Vendor"
                  onClick={notifyUpdate}
                />
              )}
            {(booking.order_status === "Completed" ||
              booking.order_status === "Cancel") && (
              <ButtonConfigColor
                type="create"
                label="Booking Reassign"
                onClick={() => navigate(`/add-booking-reassign/${id}`)}
              />
            )}
            {![
              "Pending",
              "Inspection",
              "Completed",
              "RNR",
              "Confirmed",
            ].includes(booking.order_status) && (
              <ButtonConfigColor
                type="create"
                label="Remove Assign"
                onClick={() => setOpenRemoveDialog(true)}
              />
            )}
          </span>
        }
      />
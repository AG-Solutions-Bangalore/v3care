<div className="container mx-auto p-4">
  <Typography variant="h4" color="gray" className="mb-6">
    Edit Booking {id}
  </Typography>

  <div className="flex gap-4">
    <div className="flex-grow">
      <div className="mb-2">
        <div className="flex justify-start space-x-4 ">
          {/* Home Deep Cleaning Button */}
          <button
            onClick={() => setActiveTab("bookingDetails")}
            className={`flex items-center gap-2 px-4 py-2 font-semibold rounded-lg border-b-4 ${
              activeTab === "bookingDetails"
                ? "border-blue-500 bg-blue-100 text-blue-600"
                : "border-transparent hover:bg-blue-50"
            }`}
          >
            <FaHome />
            {booking?.order_service}
          </button>

          {/* Booking Overview Button */}
          <button
            onClick={() => setActiveTab("customerInfo")}
            className={`flex items-center gap-2 px-4 py-2 font-semibold rounded-lg border-b-4 ${
              activeTab === "customerInfo"
                ? "border-green-500 bg-green-100 text-green-600"
                : "border-transparent hover:bg-green-50"
            }`}
          >
            <FaClipboardList />
            Booking Overview
          </button>

          {/* Other Details Button */}
          <button
            onClick={() => setActiveTab("additionalInfo")}
            className={`flex items-center gap-2 px-4 py-2 font-semibold rounded-lg border-b-4 ${
              activeTab === "additionalInfo"
                ? "border-red-500 bg-red-100 text-red-600"
                : "border-transparent hover:bg-red-50"
            }`}
          >
            <FaInfoCircle />
            Other Details
          </button>
        </div>

        {/* Main Content Based on Active Tab */}
        <Card className="mt-2">
          <CardBody>{renderActiveTabContent()}</CardBody>
        </Card>
      </div>

      {/* Payment Card */}
      <Card className="mb-6">
        {/* here booking assign table  */}
        <CardBody>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div></div>

            <div>
              <div className="form-group">
                <Input
                  fullWidth
                  required
                  id="order_service_date"
                  label="Service Date"
                  type="date"
                  min={today}
                  name="order_service_date"
                  value={booking.order_service_date}
                  onChange={(e) => onInputChange(e)}
                />
              </div>
            </div>

            <div>
              <div className="form-group">
                <Input
                  fullWidth
                  required
                  label="Time Slot"
                  type="time"
                  name="order_time"
                  value={booking.order_time}
                  onChange={(e) => onInputChange(e)}
                />
              </div>
            </div>

            <div>
              <div className="form-group">
                <Input
                  fullWidth
                  required
                  label="Commission"
                  name="order_comm"
                  value={booking.order_comm}
                  onChange={(e) => onInputChange(e)}
                />
              </div>
            </div>

            <div>
              <div className="form-group">
                <Input
                  fullWidth
                  required
                  label="Amount"
                  name="order_amount"
                  value={booking.order_amount}
                  onChange={(e) => onInputChange(e)}
                />
              </div>
            </div>

            <div>
              <div className="form-group">
                <Input
                  fullWidth
                  label="Advance"
                  name="order_advance"
                  value={booking.order_advance}
                  onChange={(e) => onInputChange(e)}
                />
              </div>
            </div>

            <div className="col-span-2">
              <div className="form-group">
                <Input
                  fullWidth
                  label="Comment"
                  multiline
                  name="order_comment"
                  value={booking.order_comment}
                  onChange={(e) => onInputChange(e)}
                />
              </div>
            </div>

            <div>
              <div className="form-group">
                <Input
                  fullWidth
                  label="Paid Amount"
                  name="order_payment_amount"
                  value={booking.order_payment_amount}
                  onChange={(e) => onInputChange(e)}
                />
              </div>
            </div>

            <div>
              <div className="form-group">
                <Select
                  fullWidth
                  label="Payment Mode"
                  type="select"
                  name="order_payment_type"
                  value={booking.order_payment_type}
                  onChange={(e) => onInputChange(e)}
                >
                  {paymentmode.map((option) => (
                    <SelectOption
                      key={option.payment_mode}
                      value={option.payment_mode}
                    >
                      {option.payment_mode}
                    </SelectOption>
                  ))}
                </Select>
              </div>
            </div>

            <div className="col-span-2">
              <div className="form-group">
                <Input
                  fullWidth
                  label="Transaction Details"
                  name="order_transaction_details"
                  value={booking.order_transaction_details}
                  onChange={(e) => onInputChange(e)}
                />
              </div>
            </div>
          </div>

          <div className="text-center mt-6">
            <Button
              type="submit"
              className="mr-2 mb-2"
              color="primary"
              disabled={isButtonDisabled}
            >
              Update
            </Button>
            <Button
              onClick={() => navigate(`/booking-reschedule/${id}`)}
              className="mr-2 mb-2"
              color="primary"
            >
              Work in Progress
            </Button>
            <Button
              onClick={() => navigate(`/postpone-booking/${id}`)}
              className="mb-2"
              color="primary"
            >
              Postpone
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  </div>
</div>;

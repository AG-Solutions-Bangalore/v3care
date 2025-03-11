<PageHeader
  title={"Pending Payment Report"}
  label2={
    <span className="flex justify-between space-x-4">
      <span className="text-sm bg-white px-3 py-1 rounded-md shadow-sm border border-gray-300 flex items-center">
        <Calendar className="h-3 w-3 mr-1" />
        {moment(bookingDateFrom).format("DD-MMM-YYYY")}
      </span>
      <span className="text-sm bg-white px-3 py-1 rounded-md shadow-sm border border-gray-300 flex items-center">
        <Calendar className="h-3 w-3 mr-1" />
        {moment(bookingDateTo).format("DD-MMM-YYYY")}
      </span>
      <ButtonConfigColor
        type="download"
        label="Download"
        onClick={handleDownload}
      />
    </span>
  }
/>;

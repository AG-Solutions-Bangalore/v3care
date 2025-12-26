Vendor Summary Report in Report [
    VITE_SECRET_KEY=a3f8c2me987b5d1f342f6734oa2bfe89cd55e67a1o3d8c9f2b4e5ra1c7et0b1fh3d6ya9
    VITE_SECRET_VALIDATION=f2a2d3f4a5b6c7d8e9f0123456789abc

    post v3care.in/crmapi/public/api/panel-fetch-vendor-payment-report
    vendor_id   non required 
    
    v3care.in/crmapi/public/api/panel-fetch-vendor-report  -- sumbit
    
    
    
    ]
    
    
    24. in Edit Booking , with all handler in sumbit beside that make on whatsapp icon , as he click popover of these 4 field as click it run teh api and toast 
    
    [
    get v3care.in/crmapi/public/api/panel-send-whatsapp-reschedule-booking/1
    
    get v3care.in/crmapi/public/api/panel-send-whatsapp-postpone-booking/1
    
    get panel-send-whatsapp-feedback-booking/id
    get panel-send-whatsapp-reconfirmed-booking/id
    
    
    ]
     point no 9:  service , service sub , price for , amount and custom  edit open in modal 
    [
    put panel-update-booking-service/{id}
    
    order_service
    order_service_sub
    order_service_price_for
    order_service_price
    order_custom
    order_custom_price
    
    
    
    ]
    
    
    17. in edit booking put this field an  dhec can type  in all edit booking 
    [
    order_vendor_amount   --- optional 
    ]
    point no 18.  office , admin , field team   ----- add in create and edit [ --all optional 
    
    user_image
    user_bank_name
    user_account_no
    user_ifsc_code
    user_branch_name
    user_account_holder_name
    user_alternate_name
    user_alternate_mobile
    user_refered_by
    ]
    
    
    
    Point no : 33 Dashboard [ 
    post panel-fetch-dashboard-data-new
     year
     year_month
    
    ]
import React, { useState, useEffect } from 'react';
import Layout from '../../../layout/Layout';
import MasterFilter from '../../../components/MasterFilter';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Button } from '@material-tailwind/react';
import LoaderComponent from '../../../components/common/LoaderComponent';
import { BASE_URL } from '../../../base/BaseUrl';

const ServiceControl = () => {
  const [priceControl, setPriceControl] = useState({
    id: null,
    weekend_price: false,
    holiday_price: false
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchPriceControl = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-service-price-control`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        if (response.data.servicepricecontrol) {
          setPriceControl({
            id: response.data.servicepricecontrol.id,
            weekend_price: response.data.servicepricecontrol.weekend_price === 'Yes',
            holiday_price: response.data.servicepricecontrol.holiday_price === 'Yes'
          });
        }
      } catch (error) {
        toast.error(error.response.data.message);
        console.error('Error fetching price control:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPriceControl();
  }, [token]);

  const handleCheckboxChange = (field) => {
   
    if (!priceControl[field] && (priceControl.weekend_price || priceControl.holiday_price)) {
      toast.error('Only one price control option can be enabled at a time');
      return;
    }

    setPriceControl(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = async () => {
   
    if (priceControl.weekend_price && priceControl.holiday_price) {
      toast.error('Only one price control option can be enabled at a time');
      return;
    }

    try {
      setUpdating(true);
      const data = {
        weekend_price: priceControl.weekend_price ? 'Yes' : 'No',
        holiday_price: priceControl.holiday_price ? 'Yes' : 'No'
      };

      const response = await axios.put(
        `${BASE_URL}/api/panel-update-service-price-control/${priceControl.id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast.success(response.data.msg);
    } catch (error) {
        toast.error(error.response.data.message);
      console.error('Error updating price control:', error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <MasterFilter />
        <div className='mt-1 bg-white p-2 rounded-sm'>
          <LoaderComponent />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <MasterFilter />
      <div className='mt-1 bg-white p-8 rounded-sm shadow-md'>
        <h2 className='text-xl font-semibold mb-6'>Service Price Control</h2>
        
        <div className='space-y-6'>
          {/* Weekend Price Control */}
          <div className='flex items-center'>
            <label className='flex items-center cursor-pointer'>
              <div className='relative'>
                <input 
                  type='checkbox' 
                  className='sr-only'
                  checked={priceControl.weekend_price}
                  onChange={() => handleCheckboxChange('weekend_price')}
                  disabled={priceControl.holiday_price}
                />
                <div className={`block w-14 h-8 rounded-full ${priceControl.weekend_price ? 'bg-blue-500' : 'bg-gray-300'} ${priceControl.holiday_price ? 'opacity-50' : ''}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${priceControl.weekend_price ? 'transform translate-x-6' : ''}`}></div>
              </div>
              <div className={`ml-3 font-medium ${priceControl.holiday_price ? 'text-gray-400' : 'text-gray-700'}`}>
                Weekend Price ({priceControl.weekend_price ? 'Enabled' : 'Disabled'})
                {priceControl.holiday_price && <span className='text-xs block text-gray-500'>Disabled when Holiday Price is enabled</span>}
              </div>
            </label>
          </div>

          {/* Holiday Price Control */}
          <div className='flex items-center'>
            <label className='flex items-center cursor-pointer'>
              <div className='relative'>
                <input 
                  type='checkbox' 
                  className='sr-only'
                  checked={priceControl.holiday_price}
                  onChange={() => handleCheckboxChange('holiday_price')}
                  disabled={priceControl.weekend_price}
                />
                <div className={`block w-14 h-8 rounded-full ${priceControl.holiday_price ? 'bg-blue-500' : 'bg-gray-300'} ${priceControl.weekend_price ? 'opacity-50' : ''}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${priceControl.holiday_price ? 'transform translate-x-6' : ''}`}></div>
              </div>
              <div className={`ml-3 font-medium ${priceControl.weekend_price ? 'text-gray-400' : 'text-gray-700'}`}>
                Holiday Price ({priceControl.holiday_price ? 'Enabled' : 'Disabled'})
                {priceControl.weekend_price && <span className='text-xs block text-gray-500'>Disabled when Weekend Price is enabled</span>}
              </div>
            </label>
          </div>

          {/* Submit Button */}
          <div className='mt-8'>
            <Button
              onClick={handleSubmit}
              disabled={updating}
              className={`py-2 px-6 rounded-md transition ${updating ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
            >
              {updating ? 'Updating...' : 'Update Settings'}
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ServiceControl;
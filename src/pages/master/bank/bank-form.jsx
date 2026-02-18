import {
  Button,
  Input,
  Typography,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Select,
  Option,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { BASE_URL } from "../../../base/BaseUrl";
import ButtonConfigColor from "../../../components/common/ButtonConfig/ButtonConfigColor";
import { SquarePen } from "lucide-react";
import LoaderComponent from "../../../components/common/LoaderComponent";

const CreateEditBank = ({ id = null, refetch }) => {
  const isEditMode = !!id;

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataloading, setDataLoading] = useState(false);

  const [formData, setFormData] = useState({
    bank_type: "",
    bank_type_status: "Active",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditMode && open) {
      fetchBankById();
    }
  }, [id, open]);

  const fetchBankById = async () => {
    setDataLoading(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/api/panel-fetch-bank-by-id/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const data = res.data?.bank;

      setFormData({
        bank_type: data?.bank_type || "",
        bank_type_status: data?.bank_type_status || "Active",
      });
    } catch (error) {
      toast.error(error.message || "Failed to fetch bank details");
    } finally {
      setDataLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.bank_type.trim()) {
      newErrors.bank_type = "Bank type is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);

      const url = isEditMode
        ? `${BASE_URL}/api/panel-update-bank/${id}`
        : `${BASE_URL}/api/panel-create-bank`;

      const method = isEditMode ? "PUT" : "POST";

      const payload = isEditMode ? formData : { bank_type: formData.bank_type };

      const res = await axios({
        url,
        method,
        data: payload,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.data?.code == "200") {
        toast.success(
          res.data?.msg ||
            `Bank ${isEditMode ? "updated" : "created"} successfully`,
        );
        handleClose();
        refetch && refetch();
      } else {
        toast.error(res.data?.msg || "Something went wrong");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setErrors({});
    setFormData({
      bank_type: "",
      bank_type_status: "Active",
    });
  };

  return (
    <>
      <>
        {isEditMode ? (
          <div
            className="flex items-center space-x-2"
            onClick={() => setOpen(true)}
          >
            <SquarePen className="h-5 w-5 cursor-pointer hover:text-blue-700">
              <title>Edit Client</title>
            </SquarePen>
          </div>
        ) : (
          <>
            <ButtonConfigColor
              type="create"
              label="Bank"
              onClick={() => setOpen(true)}
            />
          </>
        )}
      </>

      <Dialog open={open} handler={handleClose} size="sm">
        <DialogHeader>{isEditMode ? "Edit Bank" : "Create Bank"}</DialogHeader>
        {dataloading ? (
          <LoaderComponent />
        ) : (
          <form onSubmit={handleSubmit}>
            <DialogBody className="space-y-4">
              <div>
                <Input
                  label="Bank Type"
                  name="bank_type"
                  value={formData.bank_type}
                  onChange={handleChange}
                />
                {errors.bank_type && (
                  <Typography color="red" className="text-xs mt-1">
                    {errors.bank_type}
                  </Typography>
                )}
              </div>

              {isEditMode && (
                <Select
                  label="Status"
                  value={formData.bank_type_status}
                  onChange={(val) =>
                    setFormData((prev) => ({
                      ...prev,
                      bank_type_status: val,
                    }))
                  }
                >
                  <Option value="Active">Active</Option>
                  <Option value="Inactive">Inactive</Option>
                </Select>
              )}
            </DialogBody>

            <DialogFooter>
              <ButtonConfigColor
                buttontype="button"
                type="back"
                label="Cancel"
                onClick={handleClose}
                className="mr-2"
              />
              {isEditMode ? (
                <ButtonConfigColor
                  buttontype="update"
                  type="update"
                  label="Update"
                  loading={loading}
                />
              ) : (
                <ButtonConfigColor
                  buttontype="submit"
                  type="submit"
                  label="Submit"
                  loading={loading}
                />
              )}
            </DialogFooter>
          </form>
        )}
      </Dialog>
    </>
  );
};

export default CreateEditBank;

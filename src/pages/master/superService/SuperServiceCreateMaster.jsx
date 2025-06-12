import React, { useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import MasterFilter from "../../../components/MasterFilter";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Input } from "@material-tailwind/react";
import {
  BASE_URL,
  NO_IMAGE_URL,
  SUPER_SERVICE_IMAGE_URL,
} from "../../../base/BaseUrl";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
} from "@mui/material";
import { MdArrowBack } from "react-icons/md";
import UseEscapeKey from "../../../utils/UseEscapeKey";
import ButtonConfigColor from "../../../components/common/ButtonConfig/ButtonConfigColor";
import PageHeader from "../../../components/common/PageHeader/PageHeader";
import LoaderComponent from "../../../components/common/LoaderComponent";

const SuperServiceCreateMaster = () => {
  const [superService, setSuperService] = useState({
    serviceSuper: "",
    serviceSuper_image: "",
  });
  UseEscapeKey();
  const navigate = useNavigate();
  const storedPageNo = localStorage.getItem("page-no");
  const pageNo =
    storedPageNo === "null" || storedPageNo === null ? "1" : storedPageNo;
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleBack = (e) => {
    e.preventDefault();
    navigate(`/super-service?page=${pageNo}`);
  };

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setSuperService({
      ...superService,
      [name]: value,
    });
  };

  const onSubmit = (e) => {
    setLoading(true);
    e.preventDefault();

    const data = new FormData();
    data.append("serviceSuper", superService.serviceSuper);

    data.append("serviceSuper_image", selectedFile);

    const form = document.getElementById("addIndiv");
    if (form.checkValidity()) {
      setIsButtonDisabled(true);

      axios({
        url: `${BASE_URL}/api/panel-create-super-service`,
        method: "POST",
        data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      })
        .then((res) => {
          if (res.data.code == "200") {
            toast.success(res.data?.msg || "Update successful");
            navigate(`/super-service?page=${pageNo}`);
          } else {
            toast.error(res.data?.msg || "Duplicate entry");
          }
        })
        .catch((error) => {
          console.error("Update error:", error);
          toast.error(error.response.data.message);
        })
        .finally(() => {
          setIsButtonDisabled(false);
          setLoading(false);
        });
    }
  };

  return (
    <Layout>
      <MasterFilter />
      <div className="textfields-wrapper">
        <PageHeader title={"Create Super Service"} onClick={handleBack} />

        <Card className="p-6 mt-2">
          <form
            id="addIndiv"
            autoComplete="off"
            onSubmit={onSubmit}
            className="p-4"
          >
            <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-6">
                <Input
                  label="Super Service Name"
                  type="text"
                  name="serviceSuper"
                  value={superService.serviceSuper}
                  onChange={onInputChange}
                  required
                  labelProps={{
                    className: "!text-gray-600",
                  }}
                />
              </div>
              <div className="mb-6">
                <Input
                  label="Image"
                  type="file"
                  required
                  name="serviceSuper_image"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="w-full border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="flex justify-center space-x-4 my-2">
              <ButtonConfigColor
                type="submit"
                buttontype="submit"
                label="Submit"
                disabled={isButtonDisabled}
                loading={loading}
              />

              <ButtonConfigColor
                type="back"
                buttontype="button"
                label="Cancel"
                onClick={() => navigate(-1)}
              />
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default SuperServiceCreateMaster;

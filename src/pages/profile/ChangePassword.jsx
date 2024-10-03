import React, { useContext, useState } from "react";
import {
  Card,
  CardBody,
  Typography,
  CardHeader,
  Input,
  CardFooter,
  Button,
} from "@material-tailwind/react";
import Layout from "../../layout/Layout";
import { useNavigate } from "react-router-dom";
import { ContextPanel } from "../../utils/ContextPanel";
import { toast } from "react-toastify";
import axios from "axios";
import BASE_URL from "../../base/BaseUrl";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
  const navigate = useNavigate();

  const handleSumbit = async (e) => {
    e.preventDefault();
    if (!isPanelUp) {
      navigate("/maintenance");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New Password and Confirm Password do not match.");
      return;
    }

    if (oldPassword === newPassword) {
      toast.error("New Password cannot be the same as Old Password.");
      return;
    }

    setLoading(true);

    //create a formData object and append state values
    const formData = new FormData();
    formData.append("username", localStorage.getItem("username"));
    formData.append("old_password", oldPassword);
    formData.append("password", newPassword);

    try {
      const res = await axios.post(
        `${BASE_URL}/api/panel-change-password`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.status === 200) {
        toast.success("Password changed Succesfully");
      } else {
        toast.error("password reset, Err");
      }
    } catch (error) {
      console.error("An err occured during Forget Passoword", error);
      toast.error("An err occured during Forget Passoword");
    }

    setLoading(false);
  };
  return (
    <Layout>
      <div className="mt-12 mb-8 flex flex-col gap-12">
        <Card>
          <CardHeader variant="gradient" className="bg-gray-100 mb-8 p-6">
            <Typography variant="h6" color="black">
              Change Password
            </Typography>
          </CardHeader>
          <CardBody className="flex flex-row gap-4">
            <Input
              type="password"
              label="Old Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              size="lg"
              color="blue"
              required
            />
            <Input
              type="password"
              label="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              size="lg"
              color="blue"
              required
            />
            <Input
              type="password"
              label="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              size="lg"
              color="blue"
              required
            />
          </CardBody>
          <CardFooter className="pt-0 flex justify-center">
            <Button variant="gradient" onClick={handleSumbit} color="blue">
              Submit
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default ChangePassword;

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
import { BASE_URL } from "../../base/BaseUrl";
import PageHeader from "../../components/common/PageHeader/PageHeader";
import ButtonConfigColor from "../../components/common/ButtonConfig/ButtonConfigColor";
import { FaEyeSlash } from "react-icons/fa";
import { IoEye } from "react-icons/io5";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConformPassword, setShowConformPassword] = useState(false);

  const handleSumbit = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("Fill the required Field");

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
      <PageHeader title="Chnage Password" />

      <div className="mt-2 mb-8 flex flex-col gap-12">
        <Card>
          <CardBody className="flex flex-row gap-4">
            {/* <Input
              type="password"
              label="Old Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              size="lg"
              color="blue"
              required
            /> */}
            <div className="relative w-full">
              <Input
                id="password"
                name="password"
                value={oldPassword}
                label="Old Password"
                onChange={(e) => setOldPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                size="lg"
                maxLength={16}
                placeholder="********"
              />

              <button
                type="button"
                className="absolute right-2 top-2/4 -translate-y-2/4 text-gray-600"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <FaEyeSlash size={20} /> : <IoEye size={20} />}
              </button>
            </div>
            <div className="relative w-full">
              <Input
                id="password"
                name="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                label="New Password"
                type={showNewPassword ? "text" : "password"}
                size="lg"
                maxLength={16}
                placeholder="********"
              />

              <button
                type="button"
                className="absolute right-2 top-2/4 -translate-y-2/4 text-gray-600"
                onClick={() => setShowNewPassword((prev) => !prev)}
              >
                {showNewPassword ? (
                  <FaEyeSlash size={20} />
                ) : (
                  <IoEye size={20} />
                )}
              </button>
            </div>
            {/* <Input
              type="password"
              label="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              size="lg"
              color="blue"
              required
            /> */}
            {/* <Input
              type="password"
              label="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              size="lg"
              color="blue"
              required
            /> */}

            <div className="relative w-full">
              <Input
                id="password"
                name="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                label="Confirm Password"
                type={showConformPassword ? "text" : "password"}
                size="lg"
                maxLength={16}
                placeholder="********"
              />

              <button
                type="button"
                className="absolute right-2 top-2/4 -translate-y-2/4 text-gray-600"
                onClick={() => setShowConformPassword((prev) => !prev)}
              >
                {showConformPassword ? (
                  <FaEyeSlash size={20} />
                ) : (
                  <IoEye size={20} />
                )}
              </button>
            </div>
          </CardBody>
          <CardFooter className="pt-0 flex justify-center">
            <div className="flex justify-center space-x-4">
              <ButtonConfigColor
                type="submit"
                onClick={handleSumbit}
                label="Submit"
              />

              <ButtonConfigColor
                type="back"
                buttontype="button"
                label="Cancel"
                onClick={() => navigate(-1)}
              />
            </div>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default ChangePassword;

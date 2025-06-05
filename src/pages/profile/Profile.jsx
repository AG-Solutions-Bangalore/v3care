import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Typography,
  CardHeader,
  Input,
  CardFooter,
} from "@material-tailwind/react";
import Layout from "../../layout/Layout";
import { BASE_URL } from "../../base/BaseUrl";
import axios from "axios";
import { toast } from "react-toastify";
import PageHeader from "../../components/common/PageHeader/PageHeader";
import ButtonConfigColor from "../../components/common/ButtonConfig/ButtonConfigColor";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("id");
    if (!isLoggedIn) {
      window.location = "/";
    } else {
      getData();
    }
  }, []);

  const getData = () => {
    axios
      .get(`${BASE_URL}/api/panel-fetch-profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setFirstName(res.data?.user.name);
        setPhone(res.data.user?.mobile);
        setEmail(res.data.user?.email);
      })
      .catch(() => {
        setLoader(false);
        toast.error("Failed to fetch profile data");
      });
  };

  const onUpdateProfile = (e) => {
    e.preventDefault();
    if (!firstName.trim()) return toast.error("Enter Full Name");
    if (!phone.trim() || phone.length !== 10)
      return toast.error("Enter a valid Mobile Number");
    if (!email.trim()) return toast.error("Enter Email Id");

    const data = { first_name: firstName, phone, email };

    axios
      .post(`${BASE_URL}/api/panel-update-profile`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        if (res.data.code === "401") toast.error("Duplicate Name Entry");
        else if (res.data.code === "402") toast.error("Duplicate Mobile Entry");
        else if (res.data.code === "403") toast.error("Duplicate Email Entry");
        else toast.success("Profile Updated Successfully!");
      })
      .catch(() => {
        toast.error("Profile not Updated");
      });
  };

  return (
    <Layout>
      <PageHeader title="Profile" />
      <div className="mt-2 mb-8 flex flex-col gap-12">
        <Card>
          <CardBody className="flex flex-row gap-4">
            <Input
              label="Name"
              id="name"
              type="text"
              value={firstName}
              maxLength={50}
              required
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter your name"
            />
            <Input
              label="Mobile"
              id="mobile"
              type="tel"
              value={phone}
              maxLength={10}
              required
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your mobile number"
            />
            <Input
              label="Email"
              id="email"
              type="email"
              maxLength={50}
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </CardBody>
          <CardFooter className="pt-0 flex justify-center">
            <div className="flex justify-center space-x-4 mt-2">
              <ButtonConfigColor
                type="logout"
                onClick={onUpdateProfile}
                label="Update Profile"
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

export default Profile;

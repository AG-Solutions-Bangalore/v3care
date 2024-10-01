import {
  Input,
  Checkbox,
  Button,
  Typography,
  Carousel,
} from "@material-tailwind/react";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../base/BaseUrl";
import { ContextPanel } from "../../utils/ContextPanel";
import toast, { Toaster } from "react-hot-toast";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
  const navigate = useNavigate();

  const handleSumbit = async (e) => {
    e.preventDefault();
    if (!isPanelUp) {
      navigate("/maintenance");
      return;
    }

    setLoading(true);

    //create a formData object and append state values
    const formData = new FormData();
    formData.append("username", email);
    formData.append("password", password);

    try {
      // Send POST request to login API with form data
      const res = await axios.post(`${BASE_URL}/api/panel-login`, formData);

      if (res.status === 200 && res.data?.msg === "success.") {
        const token = res.data.UserInfo?.token;
        if (token) {
          // Store the token in localStorage
          localStorage.setItem("token", token);
          localStorage.setItem("id", res.data.UserInfo.user.user_type);
          localStorage.setItem("name", res.data.UserInfo.user.name);
          localStorage.setItem("username", res.data.UserInfo.user.name);
          localStorage.setItem(
            "user_type_id",
            res.data.UserInfo.user.user_type
          );
          localStorage.setItem("branch_id", res.data.UserInfo.user.branch_id);
          navigate("/home");
        } else {
          toast.error("Login Failed, Token not received.");
        }
      } else {
        toast.error("Login Failed, Please check your credentials.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred during login.");
    }

    setLoading(false);
  };
  return (
    <>
      <Toaster
        toastOptions={{
          success: {
            style: {
              background: "green",
            },
          },
          error: {
            style: {
              background: "red",
            },
          },
        }}
        position="top-right"
        reverseOrder={false}
      />
      <section className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Section for Carousel */}
        <div className="hidden lg:block lg:w-1/2">
          <Carousel autoplay loop>
            <img
              src="/img/home-decor-3.jpeg"
              alt="Slide 1"
              className="h-full w-full object-cover"
            />
            <img
              src="/img/home-decor-4.jpeg"
              alt="Slide 2"
              className="h-full w-full object-cover"
            />
            <img
              src="/img/home-decor-1.jpeg"
              alt="Slide 3"
              className="h-full w-full object-cover"
            />
          </Carousel>
        </div>

        {/* Right Section for Login Form */}
        <div className="flex-1 flex items-center bg-blue-50 justify-center px-4 lg:px-8 py-12 lg:w-1/2">
          <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg  shadow-blue-500 ">
            <div className="flex justify-center mb-4">
              <img
                src="/img/v3logo.png"
                alt="RK Cylinder Logo"
                className="h-14 w-auto rounded-lg  "
              />
            </div>
            <h2 className="font-bold text-2xl text-[#002D74]">Login</h2>
            <p className="text-xs mt-4 text-[#002D74]">
              If you are already a member, easily log in
            </p>
            <form
              onSubmit={handleSumbit}
              method="POST"
              className="mt-8 mb-2 w-full"
            >
              <div className="mb-6 flex flex-col gap-6">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="-mb-3 font-medium"
                >
                  Your email
                </Typography>
                <Input
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  size="lg"
                  placeholder="name@mail.com"
                  className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                />
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="-mb-3 font-medium"
                >
                  Password
                </Typography>
                <Input
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  size="lg"
                  placeholder="********"
                  className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="mt-6 bg-blue-500 hover:bg-blue-600 text-white"
                fullWidth
              >
                {loading ? "Checking..." : "Sign In"}
              </Button>

              <div className="flex items-center justify-between gap-2 mt-6">
                <Typography
                  variant="small"
                  className="font-medium text-gray-900"
                >
                  <Link to="/forget-password">Forgot Password</Link>
                </Typography>
              </div>

              <Typography
                variant="paragraph"
                className="text-center text-blue-gray-500 font-medium mt-4"
              >
                <Link to="/add-booking-outside" className="text-gray-900 ml-1">
                  Book Now
                </Link>
              </Typography>
              <Typography
                variant="paragraph"
                className="text-center text-blue-gray-500 font-medium mt-4"
              >
                <Link
                  to="/become-partner-outside"
                  className="text-gray-900 ml-1"
                >
                  Become Partner
                </Link>
              </Typography>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default SignIn;

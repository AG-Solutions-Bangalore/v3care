import { Carousel, Input, Typography } from "@material-tailwind/react";
import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BASE_URL } from "../../base/BaseUrl";
import ButtonConfigColor from "../../components/common/ButtonConfig/ButtonConfigColor";
const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSumbit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.warning("Please enter a Email & Password");
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

      if (res.data.code == 200) {
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
        toast.error(
          res.data.msg || "Login Failed, Please check your credentials."
        );
      }
    } catch (error) {
      console.error(error.response.data.message);
      toast.error(
        error.response.data.message || "An error occurred during login."
      );
    }

    setLoading(false);
  };
  return (
    <>
      {/* min-h-screen to h-screen  */}
      <section className="flex flex-col lg:flex-row h-screen">
        {/* Left Section for Carousel // h-full -add */}
        <div className="hidden lg:block lg:w-1/2 h-full">
          <Carousel autoplay loop>
            <img
              src="/img/1.jpg"
              alt="Slide 1"
              className="h-full w-full object-cover"
            />
            <img
              src="/img/2.jpg"
              alt="Slide 2"
              className="h-full w-full object-cover"
            />
            <img
              src="/img/3.jpg"
              alt="Slide 3"
              className="h-full w-full object-cover"
            />
          </Carousel>
        </div>

        {/* Right Section for Login Form  h-full add*/}
        <div className="flex-1 flex items-center bg-blue-50 justify-center px-4 lg:px-8 py-12 h-full lg:w-1/2">
          <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg  shadow-blue-500 ">
            <div className="flex justify-between mb-4">
              <div>
                <h2 className="font-bold text-2xl text-[#002D74]">Login</h2>
                <p className="text-xs mt-4 text-[#002D74]">
                  If you are already a member, easily log in
                </p>
              </div>
              <img
                src="/img/v3logo.png"
                alt="V3 care  Logo"
                className="h-14 w-auto rounded-lg  "
              />
            </div>

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
                  Username
                </Typography>
                <Input
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  size="lg"
                  placeholder="Enter User Name"
                  className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                />
                <div className="flex justify-between">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="-mb-3 font-medium"
                  >
                    Password
                  </Typography>
                  <Typography
                    variant="small"
                    className=" -mb-3 font-medium hover:text-orange-600  text-gray-500 border-b border-black   "
                  >
                    <Link tabIndex={-1} to="/forget-password">
                      Forgot Password
                    </Link>
                  </Typography>
                </div>

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

              <ButtonConfigColor
                type="default"
                buttontype="submit"
                label="Sigin In"
                loading={loading}
                className="w-full"
              />
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default SignIn;

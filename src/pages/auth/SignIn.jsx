import { Carousel, Input, Typography } from "@material-tailwind/react";
import axios from "axios";
import { useState } from "react";
import { FaEyeSlash } from "react-icons/fa";
import { IoEye } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BASE_URL } from "../../base/BaseUrl";
import ButtonConfigColor from "../../components/common/ButtonConfig/ButtonConfigColor";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");

  const validate = () => {
    let valid = true;
    setPasswordError("");
    setEmailError("");

    if (!email.trim()) {
      setEmailError("username is required");
      valid = false;
    }

    if (!password.trim()) {
      setPasswordError("Password is required");
      valid = false;
    }

    return valid;
  };
  const handleSumbit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("username", email);
    formData.append("password", password);

    try {
      const res = await axios.post(`${BASE_URL}/api/panel-login`, formData);

      if (res.data.code == 200) {
        const token = res.data.UserInfo?.token;
        if (token) {
          localStorage.setItem("token", token);
          localStorage.setItem("id", res.data.UserInfo.user.user_type);
          localStorage.setItem("name", res.data.UserInfo.user.name);
          localStorage.setItem("username", res.data.UserInfo.user.name);
          localStorage.setItem(
            "user_type_id",
            res.data.UserInfo.user.user_type
          );
          localStorage.setItem("branch_id", res.data.UserInfo.user.branch_id);
          localStorage.setItem("header_user_type", res.data.user_type.userType);
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
      <section className="flex flex-col lg:flex-row h-screen">
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
                  {/* If you are already a member, easily log in */}
                  Existing Member, Login Now
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
                <div>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="mb-3 font-medium"
                  >
                    User Name
                  </Typography>
                  <Input
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    size="lg"
                    placeholder="Enter User Name"
                    className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
                    labelProps={{
                      className: "hidden",
                    }}
                    maxLength={50}
                    error={!!emailError}

                    
                  />
                  {emailError && (
                    <p className="text-red-600 text-sm mt-1">{emailError}</p>
                  )}
                </div>
                <div>
                  <div className="flex justify-between">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="mb-3 font-medium"
                    >
                      Password
                    </Typography>
                  </div>

                  <div className="relative w-full">
                    <Input
                      id="password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type={showPassword ? "text" : "password"}
                      size="lg"
                      maxLength={16}
                      placeholder="********"
                      className="!border  !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
                      labelProps={{
                        className: "hidden",
                      }}
                      error={!!passwordError}
                    />
                    {passwordError && (
                      <p className="text-red-600 text-sm mt-1">
                        {passwordError}
                      </p>
                    )}

                    <button
                      type="button"
                      className="absolute right-2 top-2/4 -translate-y-2/4 text-gray-600"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? (
                        <FaEyeSlash size={20} />
                      ) : (
                        <IoEye size={20} />
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Typography
                    variant="small"
                    className=" -mb-3 font-medium hover:text-orange-600  text-gray-500 border-b border-black   "
                  >
                    <Link tabIndex={-1} to="/forget-password">
                      Forgot Password ?
                    </Link>
                  </Typography>
                </div>
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

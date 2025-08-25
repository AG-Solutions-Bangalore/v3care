import { Input, Typography } from "@material-tailwind/react";
import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { BASE_URL } from "../../base/BaseUrl";
import ButtonConfigColor from "../../components/common/ButtonConfig/ButtonConfigColor";

const ForgetPassword = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");

  const validate = () => {
    let valid = true;
    setUsernameError("");
    setEmailError("");

    if (!username.trim()) {
      setUsernameError("Username is required");
      valid = false;
    }

    if (!email.trim()) {
      setEmailError("Email is required");
      valid = false;
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email.trim())) {
      setEmailError("Invalid email format");
      valid = false;
    }

    return valid;
  };
  
  const onResetPassword = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const response = await axios.post(
        `${BASE_URL}/api/panel-send-password?username=${username}&email=${email}`
      );

      toast.success(response.data.msg || "New Password Sent to your Email");
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
          "Email not sent due to a server error."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col lg:flex-row min-h-screen">
      <div className="flex-1 flex items-center bg-[url('/img/fp.jpg')]  bg-cover bg-center bg-no-repeat justify-center px-4 lg:px-8 py-12 lg:w-1/2">
        <div className="w-full max-w-md p-8 bg-white/90  rounded-xl shadow-lg  shadow-blue-500 ">
          <div className="flex justify-between mb-4">
            <div>
              <h2 className="font-bold text-2xl text-[#002D74]">
                Forgot Password ?
              </h2>
              <p className="text-xs mt-4 text-[#002D74]">
                User Name & Email To Reset Password
              </p>
            </div>
            <img
              src="/img/v3logo.png"
              alt="V3 care  Logo"
              className="h-14 w-auto rounded-lg  "
            />
          </div>
          <form
            method="POST"
            className="mt-8 mb-2 w-full"
            onSubmit={onResetPassword}
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
                  id="username"
                  name="username"
                  size="lg"
                  placeholder="Enter your User Name"
                  className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
                  labelProps={{
                    className: "hidden",
                  }}
                  maxLength={50}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  error={!!usernameError}
                />
                {usernameError && (
                  <p className="text-red-600 text-sm mt-1">{usernameError}</p>
                )}
              </div>
              <div>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="mb-3 font-medium"
                >
                  Email Address
                </Typography>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  size="lg"
                  maxLength={50}
                  placeholder="name@gmail.com"
                  className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
                  labelProps={{
                    className: "hidden",
                  }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={!!emailError}
                />
                {emailError && (
                  <p className="text-red-600 text-sm mt-1">{emailError}</p>
                )}
              </div>
            </div>

            <ButtonConfigColor
              type="default"
              buttontype="submit"
              label="Restore Password"
              loading={loading}
              className="w-full"
            />
            <div className="flex items-center justify-between gap-2 mt-6">
              <Typography
                variant="paragraph"
                className="text-center text-blue-gray-500 font-medium mt-4"
              >
                Remembered your password?
                <Link to="/" className="text-gray-900 ml-1">
                  Sign In
                </Link>
              </Typography>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ForgetPassword;

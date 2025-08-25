import { Card, Input, Textarea } from "@material-tailwind/react";
import { Switch } from "@mui/material";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { BASE_URL, BLOGS_IMAGE } from "../../../base/BaseUrl";
import ButtonConfigColor from "../../../components/common/ButtonConfig/ButtonConfigColor";
import PageHeader from "../../../components/common/PageHeader/PageHeader";
import MasterFilter from "../../../components/MasterFilter";
import Layout from "../../../layout/Layout";
import UseEscapeKey from "../../../utils/UseEscapeKey";

const BlogsEditMaster = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState({
    blogs_heading: "",
    blogs_description: "",
    blogs_created_date: "",
    blogs_image: "",
    blogs_status: "Active",
    blogs_sorting: "",
    blogs_meta_title: "",
    blogs_meta_description: "",
    blogs_slug: "",
  });
  const [headingError, setHeadingError] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  UseEscapeKey();
  const navigate = useNavigate();
  const storedPageNo = localStorage.getItem("page-no");
  const pageNo =
    storedPageNo === "null" || storedPageNo === null ? "1" : storedPageNo;
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchBlog = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(
            `${BASE_URL}/api/panel-fetch-blog-by-id/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const data = response?.data?.blogs;
          setBlog({
            blogs_heading: data.blogs_heading || "",
            blogs_description: data.blogs_description || "",
            blogs_created_date: data.blogs_created_date || "",
            blogs_image: data.blogs_image || "",
            blogs_status: data.blogs_status || "Active",
            blogs_sorting: data.blogs_sorting || "",
            blogs_meta_title: data.blogs_meta_title || "",
            blogs_meta_description: data.blogs_meta_description || "",
            blogs_slug: data.blogs_slug || "",
          });

          if (data?.blogs_image) {
            setImagePreview(
              `${BLOGS_IMAGE}/${data.blogs_image}?t=${new Date().getTime()}`
            );
          }
        } catch (error) {
          console.error("Error fetching blog", error);
          toast.error("Failed to load blog data");
        }
      };
      fetchBlog();
    }
  }, [id]);

  const handleBack = (e) => {
    e.preventDefault();
    navigate(`/blogs?page=${pageNo}`);
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-")
      .substring(0, 250);
  };

  const onInputChange = (e) => {
    const { name, value } = e.target;

    if (name == "blogs_heading") {
      if (value.includes("/") || value.includes("\\")) {
        setHeadingError("Blog heading cannot contain slashes ( / or \\ )");
        return;
      } else {
        setHeadingError("");
      }

      const slug = generateSlug(value);
      setBlog((prevBlog) => ({
        ...prevBlog,
        blogs_heading: value,
        blogs_slug: slug,
      }));
      return;
    }

    if (name == "blogs_sorting") {
      const onlyDigits = value.replace(/\D/g, "");
      setBlog((prevBlog) => ({
        ...prevBlog,
        [name]: onlyDigits,
      }));
      return;
    }

    setBlog((prevBlog) => ({
      ...prevBlog,
      [name]: value,
    }));
  };

  const handleStatusChange = (e) => {
    setBlog({
      ...blog,
      blogs_status: e.target.checked ? "Active" : "Inactive",
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (e) => {
    setLoading(true);
    e.preventDefault();

    if (headingError) {
      setLoading(false);
      return;
    }

    const data = new FormData();
    data.append("blogs_heading", blog.blogs_heading);
    data.append("blogs_description", blog.blogs_description);
    data.append("blogs_created_date", blog.blogs_created_date);
    data.append("blogs_status", blog.blogs_status);
    data.append("blogs_sorting", blog.blogs_sorting);
    data.append("blogs_meta_title", blog.blogs_meta_title);
    data.append("blogs_meta_description", blog.blogs_meta_description);
    data.append("blogs_slug", blog.blogs_slug);
    if (selectedFile) {
      data.append("blogs_image", selectedFile);
    }

    const form = document.getElementById("editBlog");
    if (form.checkValidity()) {
      setIsButtonDisabled(true);

      axios({
        url: `${BASE_URL}/api/panel-update-blog/${id}?_method=PUT`,
        method: "POST",
        data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      })
        .then((res) => {
          if (res.data.code == "200") {
            toast.success(res.data?.msg || "Blog updated successfully");
            navigate(`/blogs?page=${pageNo}`);
          } else {
            toast.error(res.data?.msg || "Error updating blog");
          }
        })
        .catch((error) => {
          console.error("Update error:", error);
          toast.error(error.response?.data?.message || "An error occurred");
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
        <PageHeader title={"Edit Blog"} onClick={handleBack} />

        <Card className="p-6 mt-2">
          <form
            id="editBlog"
            autoComplete="off"
            onSubmit={onSubmit}
            className="p-4"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-8 gap-x-8">
              {/* Left Column - Form Fields */}
              <div>
                <div className="space-y-5">
                  <div>
                    <Input
                      label="Blog Heading"
                      type="text"
                      name="blogs_heading"
                      value={blog.blogs_heading}
                      onChange={onInputChange}
                      required
                      maxLength={250}
                      labelProps={{
                        className: "!text-gray-600",
                      }}
                      error={!!headingError}
                    />
                    {headingError && (
                      <p className="mt-1 text-sm text-red-500">
                        {headingError}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <Input
                      label="Sorted"
                      name="blogs_sorting"
                      value={blog.blogs_sorting}
                      onChange={onInputChange}
                      maxLength={10}
                      required
                    />
                    <div>
                      <Input
                        label="Created Date"
                        type="date"
                        name="blogs_created_date"
                        value={blog.blogs_created_date}
                        onChange={onInputChange}
                        required
                        labelProps={{ className: "!text-gray-600" }}
                      />
                    </div>
                  </div>

                  <Input
                    label="Slug"
                    name="blogs_slug"
                    value={blog.blogs_slug}
                    maxLength={250}
                    readOnly
                    required
                  />
                  <div>
                    <Input
                      label="Meta Title"
                      name="blogs_meta_title"
                      value={blog.blogs_meta_title}
                      onChange={onInputChange}
                      required
                    />
                  </div>
                  <Textarea
                    label="Meta Description"
                    name="blogs_meta_description"
                    value={blog.blogs_meta_description}
                    onChange={onInputChange}
                    required
                  />
                </div>
              </div>

              {/* Right Column - Image Preview */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Blog Image
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    name="blogs_image"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-500 border p-1 rounded-md
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-md file:border-0
                          file:text-sm file:font-semibold
                          file:bg-blue-50 file:text-blue-700
                          hover:file:bg-blue-100"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Upload a new image to replace the existing one
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-full px-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">Image Preview</h3>
                      <div className="flex items-center">
                        <span
                          className={`mr-2 text-sm ${
                            blog.blogs_status === "Active"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {blog.blogs_status}
                        </span>
                        <Switch
                          checked={blog.blogs_status === "Active"}
                          onChange={handleStatusChange}
                          color="primary"
                          inputProps={{ "aria-label": "blog status toggle" }}
                        />
                      </div>
                    </div>

                    <div className="relative w-full flex justify-center items-center">
                      {imagePreview ? (
                        <div className="flex flex-col items-center">
                          <img
                            src={imagePreview}
                            alt="Blog preview"
                            className={`h-40 object-contain mb-4 rounded-md`}
                          />

                          {blog.blogs_status === "Inactive" && (
                            <div className="absolute top-0 left-0 w-full h-full bg-white bg-opacity-60 flex items-center justify-center rounded-md">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                version="1.0"
                                width="214.000000pt"
                                height="162.000000pt"
                                viewBox="0 0 214.000000 162.000000"
                                preserveAspectRatio="xMidYMid meet"
                              >
                                <g transform="rotate(-15 107 81)">
                                  <g
                                    transform="translate(0.000000,162.000000) scale(0.100000,-0.100000)"
                                    fill="#000000"
                                    stroke="none"
                                  >
                                    <path
                                      d="M950 1480 c-30 -4 -75 -13 -99 -20 -65 -17 -199 -89 -222 -118 -11 -14 -29 -30 -41 -36 -21 -10 -113 -115 -106 -121 2 -1 33 1 70 6 59 7 74 14 123 54 107 87 236 134 367 135 31 0 58 3 61 8 2 4 2 1 1 -5 -5 -19 27 -16 41 4 7 9 17 13 24 9 9 -6 9 -11 0 -22 -9 -11 -8 -14 9 -14 11 0 55 -17 98 -39 72 -35 84 -38 134 -32 38 4 56 11 57 21 3 20 -70 73 -150 109 -90 41 -93 42 -131 26 -44 -19 -47 -19 -40 0 4 8 14 15 23 16 12 0 11 2 -4 8 -32 13 -155 20 -215 11z m134 -25 c-4 -8 -8 -15 -10 -15 -2 0 -4 7 -4 15 0 8 4 15 10 15 5 0 7 -7 4 -15z m-69 -15 c-3 -5 -12 -10 -18 -10 -7 0 -6 4 3 10 19 12 23 12 15 0z m30 -20 c-3 -5 -21 -9 -38 -9 l-32 1 30 8 c43 11 47 11 40 0z m-135 -15 c-7 -8 -20 -15 -29 -15 -11 1 -8 5 9 15 32 18 35 18 20 0z m-65 -34 c-3 -6 -11 -11 -17 -11 -6 0 -6 6 2 15 14 17 26 13 15 -4z m-125 -17 c0 -2 -14 -4 -31 -4 -16 0 -28 4 -25 9 5 8 56 3 56 -5z m63 -1 c-7 -2 -21 -2 -30 0 -10 3 -4 5 12 5 17 0 24 -2 18 -5z m527 -13 c0 -5 -4 -10 -10 -10 -5 0 -10 5 -10 10 0 6 5 10 10 10 6 0 10 -4 10 -10z m80 -21 c0 -5 -4 -9 -10 -9 -5 0 -10 7 -10 16 0 8 5 12 10 9 6 -3 10 -10 10 -16z"
                                      fill="#B82631"
                                    />
                                    <path
                                      d="M1939 1268 c0 -2 -3 -21 -5 -43 -6 -44 -14 -60 -14 -26 0 12 -4 19 -10 16 -6 -4 -10 5 -10 19 0 14 -2 26 -5 26 -26 0 -283 -32 -295 -37 -8 -3 -24 -5 -35 -4 -11 0 -112 -10 -225 -23 -154 -18 -207 -28 -216 -40 -6 -9 -17 -16 -24 -16 -8 0 -10 -8 -6 -26 5 -19 3 -25 -6 -22 -7 3 -14 14 -16 26 -5 33 -27 45 -72 37 -22 -4 -38 -11 -34 -16 3 -5 0 -9 -5 -9 -6 0 -11 5 -11 10 0 15 -40 12 -56 -5 -17 -17 -39 -21 -29 -5 8 13 1 13 -124 -5 -58 -8 -108 -20 -112 -26 -5 -8 -8 -8 -11 1 -3 10 -11 9 -31 -5 -16 -10 -27 -13 -27 -6 0 14 -103 5 -108 -9 -4 -12 -32 -14 -32 -2 0 4 -28 4 -62 0 -35 -5 -70 -8 -80 -9 -9 0 -19 -10 -22 -22 -6 -21 -7 -21 -20 -4 -12 16 -24 17 -87 12 -41 -3 -75 -8 -77 -10 -2 -2 0 -24 3 -49 5 -34 12 -46 24 -46 15 0 170 18 298 35 28 4 43 12 46 23 4 15 5 15 6 -1 1 -14 8 -16 38 -12 36 5 247 30 343 41 71 8 263 33 283 37 10 2 23 10 28 18 7 11 9 10 9 -5 0 -19 0 -19 21 0 14 13 22 15 27 6 10 -15 154 0 160 17 3 8 8 9 17 1 8 -7 88 -1 268 20 312 37 329 39 332 42 2 2 1 24 -2 51 -4 30 -10 47 -19 47 -8 0 -14 -1 -15 -2z m-889 -168 c0 -5 -5 -10 -11 -10 -5 0 -7 5 -4 10 3 6 8 10 11 10 2 0 4 -4 4 -10z m-207 -21 c-4 -15 -8 -17 -14 -8 -6 11 4 28 18 29 0 0 -1 -9 -4 -21z m-687 -66 c-10 -10 -19 5 -10 18 6 11 8 11 12 0 2 -7 1 -15 -2 -18z"
                                      fill="#B82631"
                                    />
                                    <path
                                      d="M1755 1096 c-5 -3 -27 -7 -47 -11 -24 -4 -38 -11 -38 -20 0 -8 6 -15 14 -15 9 0 15 -19 19 -57 4 -32 11 -96 17 -142 8 -74 7 -86 -7 -96 -27 -20 2 -28 72 -20 72 7 104 33 125 99 10 32 10 40 -1 47 -10 6 -11 9 -1 9 30 0 -4 143 -42 179 -22 21 -87 36 -111 27z m56 -36 c29 -16 50 -76 56 -162 6 -75 5 -77 -25 -107 -30 -31 -56 -39 -67 -22 -3 5 -8 40 -11 77 -3 37 -9 99 -14 137 -5 39 -6 75 -4 79 7 11 42 10 65 -2z"
                                      fill="#B82631"
                                    />
                                    <path
                                      d="M1530 1064 c-47 -6 -87 -12 -90 -13 -3 -1 4 -8 15 -17 17 -12 23 -38 36 -152 15 -124 15 -138 1 -150 -28 -22 0 -30 73 -21 109 13 108 13 112 43 3 18 0 25 -7 21 -5 -3 -10 -2 -10 4 0 5 6 12 13 14 9 4 8 8 -3 16 -12 9 -17 4 -24 -23 -8 -30 -14 -35 -49 -40 -22 -4 -41 -5 -43 -3 -2 2 -6 33 -10 70 -6 67 -6 67 19 67 17 0 28 -7 32 -20 9 -28 29 -25 21 3 -3 12 -6 37 -6 55 0 35 -15 43 -23 12 -5 -19 -41 -28 -50 -12 -3 4 -8 33 -11 65 l-7 57 40 0 c31 0 41 -4 46 -20 9 -27 25 -25 24 3 -1 51 -7 53 -99 41z"
                                      fill="#B82631"
                                    />
                                    <path
                                      d="M1250 1030 c-14 -4 -19 -8 -12 -9 7 -1 10 -5 7 -11 -3 -5 -2 -10 3 -10 5 0 13 -24 16 -52 4 -29 13 -56 19 -60 8 -5 9 -10 1 -18 -7 -7 -7 -33 -1 -81 6 -50 6 -74 -2 -82 -24 -24 -9 -29 62 -23 111 11 107 8 107 79 0 44 -3 58 -10 47 -5 -8 -10 -10 -11 -5 -1 6 -5 -10 -8 -35 -6 -44 -7 -45 -44 -48 -24 -2 -39 1 -41 10 -2 7 -10 71 -16 142 -12 118 -12 129 4 138 40 22 -17 36 -74 18z"
                                      fill="#B82631"
                                    />
                                    <path
                                      d="M1080 1014 c0 -5 -18 -10 -40 -10 -49 -2 -61 -11 -37 -29 10 -7 20 -30 22 -52 3 -21 8 -58 11 -83 3 -25 7 -61 9 -80 1 -19 3 -39 5 -45 1 -5 2 -21 1 -35 -1 -20 -3 -22 -11 -10 -8 13 -10 12 -10 -2 0 -20 23 -22 104 -9 82 14 113 69 85 150 -7 19 -20 33 -34 37 -22 5 -22 7 -8 36 16 31 13 102 -5 120 -13 13 -92 23 -92 12z m60 -42 c0 -10 3 -22 7 -26 4 -3 7 -21 7 -39 1 -26 -5 -35 -31 -49 -18 -10 -41 -18 -50 -17 -11 0 -13 3 -5 6 13 5 17 39 5 46 -7 4 -8 39 -4 85 1 7 15 12 36 12 27 0 35 -4 35 -18z m25 -165 c33 -47 5 -127 -44 -127 -15 0 -21 10 -27 43 -9 53 -10 90 -1 104 10 16 56 3 72 -20z m-94 -120 c-10 -9 -11 -8 -5 6 3 10 9 15 12 12 3 -3 0 -11 -7 -18z"
                                      fill="#B82631"
                                    />
                                    <path
                                      d="M831 968 c-13 -35 -23 -160 -12 -154 5 4 12 0 14 -6 3 -7 6 7 7 32 4 94 13 99 39 19 13 -41 28 -79 33 -86 13 -16 -1 -21 -44 -16 -22 3 -35 9 -32 15 4 6 -2 8 -12 6 -11 -2 -20 -13 -22 -26 -3 -21 -1 -22 17 -13 13 7 22 8 26 1 3 -5 22 -10 41 -10 27 0 37 -5 46 -25 9 -19 9 -28 0 -37 -20 -20 -13 -28 26 -28 43 0 71 13 52 25 -6 4 -20 27 -30 51 -11 24 -25 44 -32 44 -9 0 -10 2 -2 8 14 9 0 52 -16 52 -7 0 -9 8 -5 21 5 14 4 19 -4 15 -6 -4 -9 -2 -5 7 8 21 -14 67 -32 67 -13 0 -14 3 -5 14 6 7 9 21 5 30 -9 24 -43 20 -53 -6z"
                                      fill="#B82631"
                                    />
                                    <path
                                      d="M610 957 c-53 -27 -62 -113 -16 -162 28 -30 116 -79 116 -64 0 6 8 9 20 6 47 -12 4 44 -60 79 -50 27 -66 52 -58 90 5 27 34 41 58 26 28 -17 40 -15 40 7 0 30 -56 40 -100 18z"
                                      fill="#B82631"
                                    />
                                    <path
                                      d="M458 942 c-52 -3 -58 -12 -30 -40 23 -23 54 -283 34 -290 -7 -2 -12 -10 -12 -19 0 -18 39 -8 57 16 15 20 15 29 3 111 -22 144 -23 187 -3 199 28 15 4 26 -49 23z"
                                      fill="#B82631"
                                    />
                                    <path
                                      d="M195 913 c-40 -6 -53 -20 -33 -35 11 -9 21 -41 28 -98 18 -142 20 -149 38 -143 15 4 15 3 0 -10 -10 -8 -18 -22 -18 -31 0 -9 -4 -16 -10 -16 -5 0 -10 -6 -10 -14 0 -11 13 -13 63 -9 111 9 150 59 145 183 -7 152 -57 194 -203 173z m111 -38 c17 -9 30 -24 31 -37 19 -201 14 -229 -40 -247 -16 -6 -32 -10 -34 -8 -5 5 -33 237 -33 275 0 27 4 32 24 32 13 0 37 -7 52 -15z"
                                      fill="#B82631"
                                    />
                                    <path
                                      d="M690 890 c0 -14 5 -18 17 -13 11 4 13 8 5 11 -7 2 -10 8 -6 13 3 5 0 9 -5 9 -6 0 -11 -9 -11 -20z"
                                      fill="#B82631"
                                    />
                                    <path
                                      d="M714 709 c-3 -6 -3 -14 2 -18 14 -10 13 -41 -1 -41 -7 0 -18 -7 -25 -15 -12 -15 -72 -22 -68 -7 5 16 -12 72 -22 72 -5 0 -10 -20 -10 -44 0 -44 0 -44 40 -51 44 -7 84 1 74 16 -3 6 3 13 14 15 19 5 46 67 34 78 -9 10 -30 7 -38 -5z"
                                      fill="#B82631"
                                    />
                                    <path
                                      d="M808 703 c-10 -11 -18 -27 -18 -36 0 -9 -4 -17 -10 -17 -5 0 -10 -7 -10 -15 0 -16 40 -19 75 -6 17 7 17 9 3 17 -9 5 -18 24 -20 43 -3 33 -3 33 -20 14z"
                                      fill="#B82631"
                                    />
                                    <path
                                      d="M1968 693 c-38 -4 -39 -6 -42 -54 -1 -8 -9 -23 -18 -33 -10 -10 -18 -18 -18 -19 0 -3 79 3 117 9 28 4 32 8 31 37 0 45 -7 67 -21 65 -7 -1 -29 -3 -49 -5z"
                                      fill="#B82631"
                                    />
                                    <path
                                      d="M1775 669 c-33 -5 -82 -11 -110 -14 -27 -3 -59 -7 -70 -9 -11 -2 -59 -7 -107 -11 -48 -4 -86 -10 -84 -14 2 -3 -17 -6 -42 -7 -107 -2 -334 -32 -343 -45 -4 -8 -8 -8 -10 -1 -5 14 -89 3 -86 -10 1 -6 -6 -12 -15 -13 -10 -2 -15 2 -12 10 4 10 -6 11 -43 7 -26 -2 -49 -8 -51 -12 -2 -5 -11 -6 -22 -3 -27 7 -194 -16 -198 -28 -3 -6 -9 -5 -18 1 -7 7 -18 9 -24 5 -6 -4 -33 -8 -58 -10 -50 -3 -106 -9 -237 -25 -44 -6 -85 -10 -92 -10 -18 0 -18 -89 0 -96 8 -3 85 4 173 15 87 11 186 23 219 26 93 9 112 14 94 26 -13 10 12 5 47 -8 7 -2 15 0 18 6 4 6 13 8 20 5 8 -3 14 1 13 8 -1 37 5 56 20 62 20 8 32 -9 25 -36 -3 -13 0 -19 9 -17 8 1 22 -1 31 -5 9 -4 72 0 140 8 169 23 169 23 208 25 23 2 29 5 19 9 -14 6 -15 9 -3 20 11 10 16 9 25 -6 10 -16 19 -17 73 -11 33 5 104 13 156 19 52 6 109 12 125 14 17 2 81 10 143 16 112 13 114 13 109 36 -5 30 9 32 16 3 7 -28 32 -19 33 12 0 14 3 30 8 37 4 6 4 17 1 22 -7 11 -14 11 -100 -1z m-408 -85 c-3 -3 -12 -4 -19 -1 -8 3 -5 6 6 6 11 1 17 -2 13 -5z m53 -3 c0 -11 -26 -22 -34 -14 -12 12 -5 23 14 23 11 0 20 -4 20 -9z m-265 -21 c3 -5 1 -10 -4 -10 -6 0 -11 5 -11 10 0 6 2 10 4 10 3 0 8 -4 11 -10z m-55 -40 c0 -5 -2 -10 -4 -10 -3 0 -8 5 -11 10 -3 6 -1 10 4 10 6 0 11 -4 11 -10z m-507 -49 c13 -13 -7 -14 -65 -5 -23 4 -35 11 -32 19 6 14 79 4 97 -14z m-338 -21 c-3 -5 -11 -10 -16 -10 -6 0 -7 5 -4 10 3 6 11 10 16 10 6 0 7 -4 4 -10z"
                                      fill="#B82631"
                                    />
                                    <path
                                      d="M525 610 c3 -5 10 -10 16 -10 5 0 9 5 9 10 0 6 -7 10 -16 10 -8 0 -12 -4 -9 -10z"
                                      fill="#B82631"
                                    />
                                    <path
                                      d="M758 453 c7 -3 16 -2 19 1 4 3 -2 6 -13 5 -11 0 -14 -3 -6 -6z"
                                      fill="#B82631"
                                    />
                                    <path
                                      d="M1471 453 c-19 -4 -101 -62 -131 -93 -3 -3 -18 -11 -35 -19 l-30 -13 48 -15 c35 -10 47 -18 45 -31 -2 -10 3 -17 12 -17 8 0 15 6 15 14 0 8 15 19 34 23 20 6 35 17 38 29 3 10 11 19 18 19 13 0 95 88 95 103 0 7 -68 8 -109 0z m-70 -116 c-10 -9 -11 -8 -5 6 3 10 9 15 12 12 3 -3 0 -11 -7 -18z"
                                      fill="#B82631"
                                    />
                                    <path
                                      d="M600 351 l-25 -7 23 -8 c12 -4 22 -11 22 -16 0 -15 70 -63 93 -65 12 -2 21 -7 20 -12 -1 -5 25 -20 58 -33 58 -22 62 -23 89 -7 35 21 51 22 24 2 -14 -11 -15 -14 -4 -15 35 0 51 33 25 52 -5 4 -6 10 -2 14 4 4 16 -1 27 -11 14 -13 17 -22 10 -29 -5 -5 -10 -18 -10 -27 0 -23 47 -33 115 -24 43 5 54 10 59 28 3 11 0 27 -6 34 -8 10 -5 13 13 13 16 0 20 -3 11 -8 -9 -6 -7 -14 9 -31 17 -18 27 -21 52 -15 40 8 40 8 40 39 0 15 4 24 11 22 6 -2 10 -12 10 -21 -2 -20 9 -20 46 -1 36 19 39 48 8 69 -33 23 -67 20 -78 -6 -7 -19 -9 -20 -9 -4 -1 14 -6 17 -23 12 -74 -21 -142 -28 -226 -22 -51 4 -101 11 -110 16 -56 30 -131 57 -129 47 1 -7 -10 -12 -25 -12 -16 1 -28 -5 -28 -12 0 -7 -9 -13 -20 -13 -16 0 -20 7 -20 30 0 31 -6 34 -50 21z m215 -80 c-3 -6 -11 -11 -17 -11 -6 0 -6 6 2 15 14 17 26 13 15 -4z m245 -41 c0 -11 5 -20 12 -20 8 0 5 -7 -5 -17 -17 -17 -19 -17 -33 1 -14 20 -14 20 -15 0 0 -17 -1 -16 -9 4 -5 12 -14 22 -20 22 -5 0 -10 6 -10 13 0 9 14 14 40 15 34 2 40 -1 40 -18z"
                                      fill="#B82631"
                                    />
                                    <path
                                      d="M678 353 c7 -3 16 -2 19 1 4 3 -2 6 -13 5 -11 0 -14 -3 -6 -6z"
                                      fill="#B82631"
                                    />
                                    <path
                                      d="M918 173 c7 -3 16 -2 19 1 4 3 -2 6 -13 5 -11 0 -14 -3 -6 -6z"
                                      fill="#B82631"
                                    />
                                  </g>
                                </g>
                              </svg>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="h-40 flex items-center justify-center bg-gray-50 rounded-md">
                          <p className="text-gray-400">No image selected</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Blog Description <span className="text-red-500">*</span>
              </label>
              <div className="border border-gray-300 rounded-md h-64 overflow-hidden">
                {" "}
                {/* Fixed height */}
                <ReactQuill
                  theme="snow"
                  value={blog.blogs_description}
                  onChange={(value) =>
                    setBlog((prev) => ({
                      ...prev,
                      blogs_description: value,
                    }))
                  }
                  className="h-full"
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, false] }],
                      ["bold", "italic", "underline", "strike", "blockquote"],
                      [{ list: "ordered" }, { list: "bullet" }],
                      ["link", "image"],
                      ["clean"],
                    ],
                  }}
                  formats={[
                    "header",
                    "bold",
                    "italic",
                    "underline",
                    "strike",
                    "blockquote",
                    "list",
                    "bullet",
                    "link",
                    "image",
                  ]}
                />
              </div>
            </div>
            <div className="flex justify-center space-x-4 mt-8">
              <ButtonConfigColor
                type="submit"
                buttontype="submit"
                label="Update Blog"
                disabled={isButtonDisabled || headingError}
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

export default BlogsEditMaster;

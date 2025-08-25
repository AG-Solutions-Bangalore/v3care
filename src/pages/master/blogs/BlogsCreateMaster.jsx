import { Card, Input, Textarea } from "@material-tailwind/react";
import axios from "axios";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BASE_URL } from "../../../base/BaseUrl";
import ButtonConfigColor from "../../../components/common/ButtonConfig/ButtonConfigColor";
import PageHeader from "../../../components/common/PageHeader/PageHeader";
import MasterFilter from "../../../components/MasterFilter";
import Layout from "../../../layout/Layout";
import UseEscapeKey from "../../../utils/UseEscapeKey";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const BlogsCreateMaster = () => {
  const [blog, setBlog] = useState({
    blogs_heading: "",
    blogs_description: "",
    blogs_created_date: "",
    blogs_image: "",
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

    if (name === "blogs_heading") {
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
    if (name === "blogs_sorting") {
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

  const removeImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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

    data.append("blogs_sorting", blog.blogs_sorting);
    data.append("blogs_meta_title", blog.blogs_meta_title);
    data.append("blogs_meta_description", blog.blogs_meta_description);
    data.append("blogs_slug", blog.blogs_slug);
    data.append(
      "blogs_created_date",
      blog.blogs_created_date || new Date().toISOString().split("T")[0]
    );

    if (selectedFile) {
      data.append("blogs_image", selectedFile);
    }

    const form = document.getElementById("addIndiv");
    if (form.checkValidity()) {
      setIsButtonDisabled(true);

      axios({
        url: `${BASE_URL}/api/panel-create-blog`,
        method: "POST",
        data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      })
        .then((res) => {
          if (res.data.code == "200") {
            toast.success(res.data?.msg || "Blog created successfully");
            navigate(`/blogs?page=${pageNo}`);
          } else {
            toast.error(res.data?.msg || "Error creating blog");
          }
        })
        .catch((error) => {
          console.error("Create error:", error);
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
        <PageHeader title={"Create Blog"} onClick={handleBack} />

        <Card className="p-6 mt-2">
          <form
            id="addIndiv"
            autoComplete="off"
            onSubmit={onSubmit}
            className="p-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-8">
              {/* Left Column - Form Fields */}
              <div className="space-y-4">
                <div>
                  <Input
                    label="Blog Heading"
                    type="text"
                    name="blogs_heading"
                    value={blog.blogs_heading}
                    onChange={onInputChange}
                    required
                    maxLength={250}
                    labelProps={{ className: "!text-gray-600" }}
                    error={!!headingError}
                  />
                  {headingError && (
                    <p className="mt-1 text-sm text-red-500">{headingError}</p>
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
                  onChange={onInputChange}
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

              {/* Right Column - Image Preview + Additional Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Blog Image <span className="text-red-500">*</span>
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    required
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
                </div>
                <div className="w-full p-4 border border-gray-200 rounded-lg mt-2">
                  <h3 className="text-lg font-medium text-center mb-4">
                    Blog Image Preview
                  </h3>
                  {imagePreview ? (
                    <div className="flex flex-col items-center">
                      <img
                        src={imagePreview}
                        alt="Blog preview"
                        className="h-40 object-contain mb-4"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="px-4 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 text-sm"
                      >
                        Remove Image
                      </button>
                    </div>
                  ) : (
                    <div className="h-40 flex flex-col items-center justify-center bg-gray-50 rounded-md border-2 border-dashed border-gray-300">
                      <p className="text-gray-400 mb-2">No image selected</p>
                      <p className="text-xs text-red-400">Image is required</p>
                    </div>
                  )}
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
                    setBlog({ ...blog, blogs_description: value })
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
                label="Create Blog"
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

export default BlogsCreateMaster;

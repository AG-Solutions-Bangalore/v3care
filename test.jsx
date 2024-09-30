const onSubmit = (e) => {
  e.preventDefault();
  var form = document.getElementById("addIndiv").checkValidity();
  if (!form) {
    toast.error("Fill all required field");
    return;
  }
  setIsButtonDisabled(true);

  const data = new FormData();
  Object.keys(team).forEach((key) => {
    if (team[key] !== "") {
      data.append(key, team[key]);
    } else {
      data.append(key, ""); // send an empty string instead of null
    }
  });

  if (selectedFile1) {
    data.append("user_aadhar", selectedFile1);
  }
  if (selectedFile2) {
    data.append("user_pancard", selectedFile2);
  }

  axios({
    url: `${BASE_URL}/api/panel-update-admin-user/${id}?_method=PUT`,
    method: "POST",
    data,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }).then((res) => {
    if (res.data.code == "200") {
      toast.success("update succesfull");
      navigate("/field-team");
    } else {
      toast.error("duplicate entry");
    }
  });
};

import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import ButtonConfigColor from "./common/ButtonConfig/ButtonConfigColor";

const Logout = ({ open, handleOpen }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <Dialog open={open} handler={handleOpen}>
      <DialogHeader>Confirm Logout</DialogHeader>
      <DialogBody>Are you sure you want to log out?</DialogBody>
      <DialogFooter>
        {/* <Button
          variant="text"
          color="red"
          onClick={handleOpen}
          className="mr-1"
        >
          <span>Cancel</span>
        </Button>
        <Button variant="gradient" color="green" onClick={handleLogout}>
          <span>Confirm</span>
        </Button> */}

        <div className="flex justify-center space-x-4 mt-2">
          <ButtonConfigColor
            onClick={handleLogout}
            label="Confirm"
            type="logout"
          />

          <ButtonConfigColor
            type="back"
            buttontype="button"
            label="Cancel"
            onClick={handleOpen}
          />
        </div>
      </DialogFooter>
    </Dialog>
  );
};

export default Logout;

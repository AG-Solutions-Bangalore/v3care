import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Button,
} from "@material-tailwind/react";
import React, { useState, useEffect } from "react";

const UpdateSuperServiceSort = ({ open, onClose, onSubmit, data }) => {
  const [newSortNumber, setNewSortNumber] = useState("");

  useEffect(() => {
    if (data?.currentSort !== undefined) {
      setNewSortNumber(data.currentSort);
    }
  }, [data]);

  const handleSubmit = () => {
    if (!newSortNumber) return;
    onSubmit({ id: data.id, newSortNumber });
    onClose();
    setNewSortNumber("");
  };
  const handleClose = () => {
    setNewSortNumber("");
    onClose();
  };

  return (
    <Dialog open={open} handler={handleClose}>
      <DialogHeader>Update Sort Order</DialogHeader>
      <DialogBody>
        <div className="space-y-4">
          <Input
            label="New Sort Number"
            required
            value={newSortNumber}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              setNewSortNumber(value);
            }}
          />
        </div>
      </DialogBody>
      <DialogFooter>
        <Button variant="text" onClick={onClose} className="mr-2">
          Cancel
        </Button>
        <Button color="blue" onClick={handleSubmit}>
          Update
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default UpdateSuperServiceSort;

import { InputAdornment } from "@mui/material";
import { TextField } from "@mui/material";
import React, { forwardRef } from "react";

const CustomInput = forwardRef(
  ({ label, icon: Icon, required, type, ...props }, ref) => {
    return (
      <div>
        <label>
          {label}
          {required && "*"}
        </label>
        <TextField
          variant="outlined"
          fullWidth
          inputRef={ref}
          required={required}
          type={type}
          InputProps={{
            startAdornment: Icon ? (
              <InputAdornment position="start">
                <Icon sx={{ color: "blue" }} />
              </InputAdornment>
            ) : null,
          }}
          {...props}
        />
      </div>
    );
  }
);

export default CustomInput;

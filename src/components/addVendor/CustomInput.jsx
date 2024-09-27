import { Input } from "@material-tailwind/react";
import { InputAdornment } from "@mui/material";
import { TextField } from "@mui/material";
import React, { forwardRef } from "react";

const CustomInput = forwardRef(
  ({ label, icon: Icon, required, type, ...props }, ref) => {
    return (
      <div>
        <Input
          variant="outlined"
          fullWidth
          label={
            label && (
              <label
                style={{
                  fontSize: 13,
                  fontFamily: "sans-serif",
                  fontWeight: 500,
                }}
              >
                {label}
              </label>
            )
          }
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

import { Input } from "@material-tailwind/react";
import { InputAdornment } from "@mui/material";
import React, { forwardRef } from "react";

const CustomInput = forwardRef(
  ({ label, icon: Icon, required, type, maxLength, ...props }, ref) => {
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
          // inputProps={inputProps}
          maxLength={maxLength}
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

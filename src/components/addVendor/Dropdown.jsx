import { InputAdornment } from "@mui/material";
import { Autocomplete, TextField } from "@mui/material";
import React from "react";

const Dropdown = ({
  label,
  options,
  required,
  icon: Icon,
  value,
  name,
  onChange,
}) => {
  // Find the selected option to display in the input
  const selectedOption =
    options.find((option) => option.value === value) || null;

  return (
    <div>
      <label>
        {label}
        {required && "*"}
      </label>
      <Autocomplete
        disablePortal
        options={options}
        getOptionLabel={(option) => option.label || ""}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        noOptionsText="No options available"
        value={selectedOption}
        onChange={(event, newValue) => {
          onChange({
            target: { name: name, value: newValue ? newValue.value : "" },
          });
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            required={required}
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              startAdornment: Icon ? (
                <InputAdornment position="start">
                  <Icon sx={{ color: "blue" }} />
                </InputAdornment>
              ) : null,
              style: { padding: "3.5px", borderRadius: "5px" },
            }}
            fullWidth
          />
        )}
      />
    </div>
  );
};

export default Dropdown;

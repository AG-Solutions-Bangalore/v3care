import { InputAdornment, MenuItem, TextField, Typography } from "@mui/material";
import styles from "./TextField.module.css";

const Fields = (props) => {
  return (
    <>
      {props.title && (
        <Typography variant="small" className={styles["heading"]}>
          {props.title}{" "}
          {props.required && <span style={{ color: "red" }}>*</span>}
        </Typography>
      )}
      {props.type === "textField" && (
        <>
          <TextField
            required={props.required}
            multiline={props.multiline}
            name={props.name}
            type={props.types}
            autoComplete={props.autoComplete}
            className={styles["customTextField"]}
            value={props.value}
            onChange={props.onChange}
            fullWidth
            variant="outlined"
            placeholder={props.placeholder}
            {...props}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {props.startIcon}
                </InputAdornment>
              ),
            }}
          />
        </>
      )}
      {props.type === "numberField" && (
        <>
          <TextField
            required={props.required}
            name={props.name}
            type={props.types}
            autoComplete={props.autoComplete}
            className={styles["customTextField"]}
            value={props.value}
            onChange={props.onChange}
            fullWidth
            variant="outlined"
            placeholder={props.placeholder}
            {...props}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {props.startIcon}
                </InputAdornment>
              ),
              inputProps: {
                maxLength: 10,
                pattern: "[0-9]*",
              },
            }}
          />
        </>
      )}
      {props.type === "dateField" && (
        <>
          <TextField
            fullWidth
            required={props.required}
            name={props.name}
            type="date"
            id={props.id}
            autoComplete={props.autoComplete}
            onChange={props.onChange}
            value={props.value} // Explicitly set value prop here
            InputLabelProps={{
              shrink: true,
            }}
            {...props} // Spread remaining props
          />
        </>
      )}
      {props.type === "dropdown" && (
        <>
          <TextField
            required={props.required}
            name={props.name}
            variant="outlined"
            autoComplete={props.autoComplete}
            select
            SelectProps={{
              MenuProps: {},
            }}
            value={props.value}
            onChange={props.onchange}
            {...props}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {props.startIcon}
                </InputAdornment>
              ),
            }}
          >
            {props.options?.map((option, key) => (
              <MenuItem key={key} value={option.refer_by}>
                {option.refer_by}
              </MenuItem>
            ))}
          </TextField>
        </>
      )}
      {props.type === "serviceDropdown" && (
        <>
          <TextField
            fullWidth
            required={props.required}
            name={props.name}
            variant="outlined"
            autoComplete={props.autoComplete}
            select
            SelectProps={{
              MenuProps: {},
            }}
            value={props.value}
            onChange={props.onchange}
            {...props}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {props.startIcon}
                </InputAdornment>
              ),
            }}
          >
            {props.options?.map((option, key) => (
              <MenuItem key={key} value={option.id}>
                {option.service}
              </MenuItem>
            ))}
          </TextField>
        </>
      )}
      {props.type === "branchDropdown" && (
        <>
          <TextField
            fullWidth
            required={props.required}
            name={props.name}
            variant="outlined"
            autoComplete={props.autoComplete}
            select
            SelectProps={{
              MenuProps: {},
            }}
            value={props.value}
            onChange={props.onchange}
            {...props}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {props.startIcon}
                </InputAdornment>
              ),
            }}
          >
            {props.options?.map((option, key) => (
              <MenuItem key={key} value={option.id}>
                {option.branch_name}
              </MenuItem>
            ))}
          </TextField>
        </>
      )}
      {props.type === "whatsappDropdown" && (
        <>
          <TextField
            fullWidth
            required={props.required}
            name={props.name}
            variant="outlined"
            autoComplete={props.autoComplete}
            select
            SelectProps={{
              MenuProps: {},
            }}
            value={props.value}
            onChange={props.onchange}
            {...props}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {props.startIcon}
                </InputAdornment>
              ),
            }}
          >
            {props.options?.map((option, key) => (
              <MenuItem key={key} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </>
      )}
      {props.type === "subServiceDropdown" && (
        <>
          <TextField
            fullWidth
            required={props.required}
            name={props.name}
            variant="outlined"
            autoComplete={props.autoComplete}
            select
            SelectProps={{
              MenuProps: {},
            }}
            value={props.value}
            onChange={props.onchange}
            {...props}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {props.startIcon}
                </InputAdornment>
              ),
            }}
          >
            {props.options?.map((option, key) => (
              <MenuItem key={key} value={option.id}>
                {option.service_sub}
              </MenuItem>
            ))}
          </TextField>
        </>
      )}
      {props.type === "priceforDropdown" && (
        <>
          <TextField
            fullWidth
            required={props.required}
            name={props.name}
            variant="outlined"
            autoComplete={props.autoComplete}
            select
            SelectProps={{
              MenuProps: {},
            }}
            value={props.value}
            onChange={props.onchange}
            {...props}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {props.startIcon}
                </InputAdornment>
              ),
            }}
          >
            {props.options?.map((option, key) => (
              <MenuItem key={key} value={option.id}>
                {option.service_price_for} - {option.service_price_rate}
              </MenuItem>
            ))}
          </TextField>
        </>
      )}
    </>
  );
};

export default Fields;

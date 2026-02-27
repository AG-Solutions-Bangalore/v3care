import Select from "react-select";

const EmployeeMultiSelect = ({
  employees = [],
  selectedEmployees = [],
  setSelectedEmployees,
}) => {
  const options = employees.map((emp) => ({
    value: emp.id,
    label: emp.name,
  }));

  return (
    <Select
      isMulti
      options={options}
      value={options.filter((option) =>
        selectedEmployees.includes(option.value),
      )}
      onChange={(selected) =>
        setSelectedEmployees(selected ? selected.map((s) => s.value) : [])
      }
      placeholder="Select Employees"
      className="text-xs"
      styles={{
        control: (base) => ({
          ...base,
          minHeight: "32px",
          fontSize: "12px",
        }),
        multiValue: (base) => ({
          ...base,
          fontSize: "11px",
        }),
      }}
    />
  );
};

export default EmployeeMultiSelect;

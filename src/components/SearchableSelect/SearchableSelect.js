import React, { useMemo } from "react";
import Select from "react-select";

/**
 * SearchableSelect — a searchable single-select built on react-select.
 *
 * Why this exists:
 *  - The Format-Reports pages (sanction order / work order / ARN) use long native
 *    <select> dropdowns that are hard to scan through. This gives type-ahead search.
 *  - The backing APIs return one row per application, so the same sanction-order /
 *    work-order / ARN value repeats many times. This de-duplicates the options so
 *    each value shows exactly once.
 *
 * Drop-in contract:
 *  - `options` may be an array of plain strings OR of { label, value } objects.
 *  - `value` / `onChange` speak plain strings, so it slots straight into existing
 *    state like `addressDetails.sanctionOrderNumber` with no other changes.
 *  - The menu is portalled to <body> so it is never clipped inside cards/modals.
 */
export default function SearchableSelect({
  options = [],
  value = "",
  onChange,
  placeholder = "— Select —",
  isDisabled = false,
  isClearable = true,
  isInvalid = false,
  name,
  inputId,
}) {
  // De-duplicate by value, drop empty/blank entries, preserve first-seen order.
  const normalized = useMemo(() => {
    const seen = new Set();
    const result = [];
    (options || []).forEach((opt) => {
      const rawValue = opt && typeof opt === "object" ? opt.value : opt;
      if (rawValue === null || rawValue === undefined) return;
      const val = String(rawValue).trim();
      if (!val || seen.has(val)) return;
      seen.add(val);
      const rawLabel = opt && typeof opt === "object" ? opt.label : opt;
      result.push({ value: val, label: String(rawLabel ?? val) });
    });
    return result;
  }, [options]);

  const selected =
    normalized.find((o) => o.value === String(value ?? "")) || null;

  // Match the look of the surrounding native selects (rounded, light background).
  const styles = {
    control: (base, state) => ({
      ...base,
      minHeight: "42px",
      borderRadius: "8px",
      border: isInvalid
        ? "1.5px solid #dc3545"
        : state.isFocused
        ? "1.5px solid #1e67a8"
        : "1.5px solid #d0d9e8",
      backgroundColor: isDisabled ? "#eef2f7" : "#f8fafd",
      boxShadow: "none",
      fontSize: "14px",
      "&:hover": { borderColor: isInvalid ? "#dc3545" : "#1e67a8" },
    }),
    placeholder: (base) => ({ ...base, color: "#8896ab" }),
    singleValue: (base) => ({ ...base, color: "#333" }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    menu: (base) => ({ ...base, borderRadius: "10px", overflow: "hidden" }),
    option: (base, state) => ({
      ...base,
      fontSize: "14px",
      backgroundColor: state.isSelected
        ? "#1e67a8"
        : state.isFocused
        ? "#eaf2fb"
        : "#fff",
      color: state.isSelected ? "#fff" : "#333",
      cursor: "pointer",
    }),
  };

  return (
    <Select
      inputId={inputId}
      name={name}
      classNamePrefix="searchable-select"
      options={normalized}
      value={selected}
      onChange={(opt) => onChange && onChange(opt ? opt.value : "")}
      placeholder={placeholder}
      isDisabled={isDisabled}
      isClearable={isClearable}
      isSearchable
      noOptionsMessage={() => "No matches"}
      menuPortalTarget={typeof document !== "undefined" ? document.body : null}
      menuPosition="fixed"
      styles={styles}
    />
  );
}

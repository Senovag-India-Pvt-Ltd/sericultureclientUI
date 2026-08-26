import React from "react";
import RDTDataTable from "react-data-table-component";
import { useTranslation } from "react-i18next";

// Thin wrapper around react-data-table-component that localizes the
// library's built-in "Loading..." / "There are no records to display"
// text, which otherwise renders in English regardless of the app's
// selected language. Any page can still override noDataComponent /
// progressComponent by passing its own prop.
function DataTable(props) {
  const { t } = useTranslation();
  return (
    <RDTDataTable
      noDataComponent={<div className="py-4">{t("There are no records to display")}</div>}
      progressComponent={<div className="py-4">{t("Loading...")}</div>}
      {...props}
    />
  );
}

export default DataTable;

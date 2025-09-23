import React, { useEffect, useRef } from "react";
import $ from "jquery";
import "datatables.net-bs5";
import "datatables.net-buttons-bs5";
import "datatables.net-buttons/js/buttons.html5";
import "datatables.net-responsive-bs5";
import jszip from "jszip";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

// Fix: pdfFonts might be default export
pdfMake.vfs = pdfFonts?.default?.vfs || pdfFonts.vfs;

const TableList = ({ data = [], columns = [], options = {}, className }) => {
  const tableRef = useRef(null);
  const dtInstance = useRef(null);

  useEffect(() => {
    if (!tableRef.current) return;

    // Destroy previous instance if exists
    if (dtInstance.current) {
      $(tableRef.current).DataTable().destroy();
      $(tableRef.current).empty();
    }

    dtInstance.current = $(tableRef.current).DataTable({
      data,
      columns,
      dom: "Bfrtip",
      buttons: ["copy", "csv", "excel", "pdf"],
      responsive: true,
      ...options,
    });

    return () => {
      if (dtInstance.current) dtInstance.current.destroy();
    };
  }, [data, columns, options]);

  return (
    <table
      ref={tableRef}
      className={className || "table table-striped dt-responsive w-100"}
    />
  );
};

export default TableList;

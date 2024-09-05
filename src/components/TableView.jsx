const TableView = ({ data }) => {
  if (!data) return null;

  const keys = Object.keys(data[0] || {});
  const rows = Array.isArray(data) ? data : [data];

  return (
    <div
      style={{
        margin: "20px",
        padding: "10px",
        backgroundColor: "#f0f0f0",
        borderRadius: "8px",
        border: "4px solid",
        borderColor: "#adaaaa",
        maxWidth: "800px",
        maxHeight: "400px",
        overflow: "auto",
      }}
    >
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {keys.map((key) => (
              <th
                key={key}
                style={{
                  border: "1px solid #ddd",
                  padding: "8px",
                  backgroundColor: "#f5f5f5",
                  whiteSpace: "nowrap",
                }}
              >
                {key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              {keys.map((key) => (
                <td
                  key={key}
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "left",
                    maxWidth: "150px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  title={row[key] ? row[key].toString() : ""}
                >
                  {row[key] ? row[key].toString() : ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableView;

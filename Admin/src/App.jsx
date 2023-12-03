import axios from "axios";
import{ useEffect, useState } from "react";
import DataTable from "react-data-table-component";

const App = () => {
  const [search, setSearch] = useState("");
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editedItemId, setEditedItemId] = useState(null);
  const [editedItemData, setEditedItemData] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);

  const getCountries = async () => {
    try {
      const response = await axios.get(
        "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
      );
      setCountries(response.data);
      setFilteredCountries(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      name: "Serial Number",
      selector: "id",
    },
    {
      name: "Name",
      selector: "name",
      sortable: true,
      cell: (row) => renderEditableCell(row, "name"),
    },
    {
      name: "Email",
      selector: "email",
      cell: (row) => renderEditableCell(row, "email"),
    },
    {
      name: "Role",
      selector: "role",
      cell: (row) => renderEditableCell(row, "role"),
    },
    {
      name: "Action",
      cell: (row) => (
        <div>
          <button
            className="btn btn-primary"
            style={{ padding: "5px" ,background:'blue' , color:'white' , cursor:"pointer" }}
            onClick={() => handleAction(row)}
          >
            {editMode && editedItemId === row.id ? "Save" : "Edit"}
          </button>
          <button
            className="btn btn-danger"
            style={{ padding: "5px" , background:'red' , color:'white' ,  cursor:"pointer" }}
            onClick={() => handleDelete(row)}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const renderEditableCell = (row, field) => {
    return (
      <div>
        {editMode && editedItemId === row.id ? (
          <input
            type="text"
            value={editedItemData[field] || ""}
            onChange={(e) => handleFieldChange(field, e.target.value)}
          />
        ) : (
          <div
            onClick={() => handleEdit(row.id)}
            style={{ cursor: "pointer" , pointerEvents:'none' }}
          >
            {row[field]}
          </div>
        )}
      </div>
    );
  };
  

  const handleEdit = (id) => {
    setEditMode(true);
    setEditedItemId(id);
    const editedItem = countries.find((element) => element.id === id);
    setEditedItemData(editedItem);
  };

  const handleFieldChange = (field, value) => {
    setEditedItemData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleSave = () => {
    const updatedCountries = countries.map((item) =>
    item.id === editedItemId ? { ...item, ...editedItemData } : item
    );
    setCountries(updatedCountries);
    setFilteredCountries(updatedCountries);
    setEditMode(false);
    setEditedItemId(null);
    setEditedItemData({});
  };

  const handleAction = (row) => {
    if (editMode && editedItemId === row.id) {
      handleSave();
    } else {
      handleEdit(row.id);
    }
  };

  const handleDelete = (row) => {
    const updatedCountries = countries.filter(
      (vari) => vari.id !== row.id
    );
    setCountries(updatedCountries);
    setFilteredCountries(updatedCountries);
  };

  const handleSelectedRowsChange = ({ selectedRows }) => {
    setSelectedRows(selectedRows);
  };

  const handleDeleteSelected = () => {
    const updatedCountries = countries.filter(
      (normal) => !selectedRows.map((row) => row.id).includes(normal.id)
    );
    setCountries(updatedCountries);
    setFilteredCountries(updatedCountries);
    setSelectedRows([]);
  };

  useEffect(() => {
    getCountries();
  }, []);

  useEffect(() => {
    const result = countries.filter((identity) => {
      return identity.name.toLowerCase().includes(search.toLowerCase());
    });
    setFilteredCountries(result);
  }, [search]);

  const customStyles = {
    headRow: {
      style: {
        backgroundColor: '#4285f4', // Change the color to your desired value
        color: 'white', // Change the text color to your desired value
      },
    },
  };

  return (
    <div>
      <DataTable
        title="Employee List"
        columns={columns}
        data={filteredCountries}
        pagination
        fixedHeader
        fixedHeaderScrollHeight="450px"
        selectableRows
        selectableRowsHighlight
        highlightOnHover
        subHeader
        noHeader
        subHeaderComponent={
          <>
            <button
              style={{
                marginRight: "2rem",
                padding: "5px",
                background: "cyan",
                fontWeight: "700",
                border: "2px solid black",
              }}
              onClick={handleDeleteSelected}
            >
              Delete Selected
            </button>
            <input
              type="text"
              placeholder="Search Here"
              className="w-25 form-control"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </>
        }
        onSelectedRowsChange={handleSelectedRowsChange}
        customStyles={customStyles}
      />
    </div>
  );
};

export default App;


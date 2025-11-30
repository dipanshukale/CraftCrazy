// src/pages/DemandOrdersPage.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { getApiUrl } from "../config/api";
import {
  DataGrid,
  GridColDef,
  GridRowParams,
} from "@mui/x-data-grid";
import {
  Box,
  Typography,
  Avatar,
  Drawer,
  Divider,
  Chip,
  Stack,
} from "@mui/material";

interface DemandOrder {
  id: string;
  name: string;
  email: string;
  phone: number;
  product: string;
  customization?: string;
  imageUrl?: string;
}

export default function DemandOrdersPage() {
  const [rows, setRows] = useState<DemandOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<DemandOrder | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const columns: GridColDef[] = [
    { field: "name", headerName: "Customer", width: 180 },
    { field: "email", headerName: "Email", width: 230 },
    { field: "phone", headerName: "Phone", width: 140 },
    { field: "product", headerName: "Product", width: 180 },
    { field: "customization", headerName: "Customization", width: 230 },
    {
      field: "imageUrl",
      headerName: "Image",
      width: 120,
      renderCell: (params) =>
        params.value ? (
          <Avatar
            src={params.value}
            variant="rounded"
            sx={{ width: 60, height: 60, cursor: "pointer" }}
          />
        ) : (
          <Chip label="No Image" size="small" />
        ),
    },
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await axios.get(getApiUrl("api/demand/demandOrder"));

        const mappedRows: DemandOrder[] = res.data?.customizedOrder?.map((item: any) => ({
          id: item._id,
          name: item.name,
          email: item.email,
          phone: item.phone,
          product: item.product,
          customization: item.customization,
          imageUrl: item.imageUrl,
        }));
        setRows(mappedRows);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleRowClick = (params: GridRowParams) => {
    setSelectedOrder(params.row as DemandOrder);
    setDrawerOpen(true);
  };

  return (
    <Box sx={{ p: 4, background: "#f5f6f8", minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight={700} mb={3}>
        Customized Product Requests
      </Typography>

      <Box
        sx={{
          background: "#fff",
          borderRadius: 3,
          boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
          p: 2,
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          onRowClick={handleRowClick}
          autoHeight
          disableColumnResize
          disableColumnFilter
          disableColumnMenu
          pageSizeOptions={[10, 20, 50]}
          columnHeaderHeight={55}
          rowHeight={65}
          sx={{
            border: "none",
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#111827",
              color: "black",
              fontWeight: 600,
            }
          }}
        />
      </Box>

      {/* Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: 400, p: 3 } }}
      >
        {selectedOrder && (
          <>
            <Typography variant="h5" fontWeight={700}>Order Details</Typography>
            <Divider sx={{ my: 2 }} />

            <Stack spacing={1.5}>
              <Typography><strong>Name:</strong> {selectedOrder.name}</Typography>
              <Typography><strong>Email:</strong> {selectedOrder.email}</Typography>
              <Typography><strong>Phone:</strong> {selectedOrder.phone}</Typography>
              <Typography><strong>Product:</strong> {selectedOrder.product}</Typography>
              <Typography><strong>Customization:</strong> {selectedOrder.customization || "None"}</Typography>

              <Typography fontWeight={600} mt={2}>Image</Typography>
              {selectedOrder.imageUrl ? (
                <Avatar
                  src={selectedOrder.imageUrl}
                  variant="rounded"
                  sx={{ width: "100%", height: 240 }}
                />
              ) : (
                <Chip label="No Image Uploaded" />
              )}
            </Stack>
          </>
        )}
      </Drawer>
    </Box>
  );
}

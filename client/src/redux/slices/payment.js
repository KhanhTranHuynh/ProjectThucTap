import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const addNewPayment = createAsyncThunk(
  "users/addNewPayment",
  async ({ id, Oder_TotalPrice, email }) => {
    const response = await axios.post(
      "http://localhost:55009/api/PaymentRouter/addnew",
      {
        id: id,
        Oder_TotalPrice: Oder_TotalPrice,
        UserID: email,
      }
    );
    return response.data.data;
  }
);

export const getPrice = createAsyncThunk(
  "users/getPrice",
  async (app_trans_id) => {
    const response = await axios.post(
      "http://localhost:55009/api/OderRouter/getSumForPayment",
      {
        app_trans_id: parseInt(app_trans_id),
      }
    );
    return response.data.data;
  }
);

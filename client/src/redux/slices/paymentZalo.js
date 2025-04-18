import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const paymentZalo = createAsyncThunk(
  "users/paymentZalo",
  async ({ Oder_TotalPrice, app_trans_id }) => {
    const response = await axios.post(
      "http://localhost:55009/api/PaymentRouter/paymentZalo",
      {
        Oder_TotalPrice: Oder_TotalPrice,
        app_trans_id: app_trans_id,
      }
    );
    return response;
  }
);

import { configureStore } from "@reduxjs/toolkit";
import ForRealTime from "./slices/ForRealTime";
import userReducer, { fetchUserEmail } from "./slices/userSlice"; // 👈 import thunk

const store = configureStore({
  reducer: {
    data: ForRealTime,
    user: userReducer,
  },
});

// ✅ Ghi nhớ đăng nhập và gọi API
if (localStorage.getItem("token") != null) {
  store.dispatch(fetchUserEmail(localStorage.getItem("token")));
}

export default store;

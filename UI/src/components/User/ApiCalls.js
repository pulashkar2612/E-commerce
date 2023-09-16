import axios from "axios";
import { urls } from "../../utils/urls";

export async function getCartAPI() {
  try {
    return await axios.get(urls.getCartProducts);
  } catch (err) {
    return err?.response?.data;
  }
}

export async function clearCartAPI() {
  try {
    return await axios.get(urls.clearCart);
  } catch (err) {
    return err?.response?.data;
  }
}

export async function removeFromCartAPI(productId) {
  try {
    return await axios.post(urls.removeFromCart, {
      productId: productId,
    });
  } catch (err) {
    return err?.response?.data;
  }
}

export async function addToCartAPI(productId) {
  try {
    return await axios.post(urls.addToCart, {
      productId: productId,
    });
  } catch (err) {
    return err?.response?.data;
  }
}

export async function placeOrderAPI(products) {
  try {
    return await axios.post(urls.placeOrder, {
      productId: products,
    });
  } catch (err) {
    return err?.response?.data;
  }
}

export async function logoutAPI() {
  try {
    return await axios.post(urls.logout, {
      sessionId: sessionStorage.getItem("sessionId"),
    });
  } catch (err) {
    return err?.response?.data;
  }
}

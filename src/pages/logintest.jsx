// ------------------------------
// authClient.js
// این ماژول یک کلاینت جمع و جور برای ورود با public/private key و DPoP است.
// کارکردش تولید جفت کلید برای هر دستگاه، ارسال public JWK به سرور، گرفتن توکن و ذخیره‌سازی امن، و نگه‌داری از توکن‌های JWT است.
// همچنین درخواست‌هایی که نیاز به احراز هویت دارند را به صورت امن و با DPoP و auto-refresh ارسال می‌کند.

// نصب وابستگی‌ها:
//   npm i jose uuid

import { SignJWT, importJWK } from "jose";
import { v4 as uuidv4 } from "uuid";

// ----------- پیکربندی -------------

const API_BASE = "http://localhost:8000";
const LOGIN_PATH = "/login/";
const REFRESH_PATH = "/refresh-token/";

// ----------- مدیریت ذخیره محلی -------------

const storage = {
  saveTokens: (tokens) => localStorage.setItem("auth:tokens", JSON.stringify(tokens)),
  loadTokens: () => {
    const raw = localStorage.getItem("auth:tokens");
    return raw ? JSON.parse(raw) : null;
  },
  clearTokens: () => localStorage.removeItem("auth:tokens"),

  savePrivateJwk: (jwk) => localStorage.setItem("auth:private_jwk", JSON.stringify(jwk)),
  loadPrivateJwk: () => {
    const raw = localStorage.getItem("auth:private_jwk");
    return raw ? JSON.parse(raw) : null;
  },
  clearPrivateJwk: () => localStorage.removeItem("auth:private_jwk"),
};

// ----------- توابع کمکی -------------

// رشته را به hex تبدیل می‌کند
function strToHex(str) {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(str);
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}

// مسیر را به BASE URL اپند می‌کند
function baseUrlCombine(path) {
  return API_BASE.replace(/\/+$/, "") + (path.startsWith("/") ? path : "/" + path);
}

// کلید JWK عمومی/خصوصی EC می‌سازد
async function generateKeyPairJwk() {
  const keyPair = await crypto.subtle.generateKey(
    { name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"]
  );

  const publicJwk = await crypto.subtle.exportKey("jwk", keyPair.publicKey);
  const privateJwk = await crypto.subtle.exportKey("jwk", keyPair.privateKey);

  publicJwk.alg = "ES256";
  publicJwk.key_ops = ["verify"];
  publicJwk.use = "sig";

  privateJwk.alg = "ES256";
  privateJwk.key_ops = ["sign"];
  privateJwk.use = "sig";

  return { publicJwk, privateJwk };
}

// ساخت JWT اثبات DPoP برای درخواست‌های محافظت‌شده
async function createDpop(privateJwk, publicJwk, htu, htm) {
  const key = await importJWK(privateJwk, "ES256");
  const iat = Math.floor(Date.now() / 1000);
  const jti = uuidv4();

  const payload = {
    htm: htm.toUpperCase(),
    htu,
    iat,
    jti,
  };
  const protectedHeader = {
    alg: "ES256",
    typ: "dpop+jwt",
    jwk: publicJwk,
  };

  return await new SignJWT(payload).setProtectedHeader(protectedHeader).sign(key);
}

// ----------- ورود (login) -------------

// login جفت کلید تولید می‌کند، public JWK را hex می‌کند و همراه یوزرنیم و پسورد می‌فرستد، توکن می‌گیرد و ذخیره می‌کند.
export async function login({ username, password }) {
  // تولید جفت کلید
  const { publicJwk, privateJwk } = await generateKeyPairJwk();
  // public JWK را hex کن
  const publicJson = JSON.stringify(publicJwk);
  const publicHex = strToHex(publicJson);

  // آماده‌سازی داده فرم
  const body = new URLSearchParams();
  body.append("username", username);
  body.append("password", password);

  // درخواست به سرور
  const res = await fetch(baseUrlCombine(LOGIN_PATH), {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "X-Client-JWK": publicHex, // public JWK سمت کلاینت که سرور چک می‌کند
    },
    body: body.toString(),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => null);
    throw new Error(`Login failed (${res.status}): ${txt || res.statusText}`);
  }

  const data = await res.json();

  // ذخیره توکن و کلید خصوصی برای استفاده‌های بعدی 
  storage.saveTokens({
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    access_expires_in: data.access_expires_in,
    refresh_expires_in: data.refresh_expires_in,
    role: data.role,
    user_id: data.user_id,
  });
  storage.savePrivateJwk(privateJwk);

  return data;
}

// ----------- رفرش توکن -------------

// refreshTokens اگر access token منقضی شد، از refresh token همراه DPoP JWT یک توکن جدید می‌گیرد
export async function refreshTokens() {
  const tokens = storage.loadTokens();
  const privateJwk = storage.loadPrivateJwk();
  if (!tokens || !tokens.refresh_token) throw new Error("No refresh token available");

  const refreshUrl = baseUrlCombine(REFRESH_PATH);
  // ساخت public JWK از private (صرفاً d را حذف می‌کنیم)
  const publicJwk = Object.assign({}, privateJwk);
  delete publicJwk.d;
  const dpop = await createDpop(privateJwk, publicJwk, refreshUrl, "POST");

  const res = await fetch(refreshUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${tokens.refresh_token}`,
      DPoP: dpop,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    storage.clearTokens();
    storage.clearPrivateJwk();
    const txt = await res.text().catch(() => null);
    throw new Error(`Refresh failed (${res.status}): ${txt || res.statusText}`);
  }

  const data = await res.json();
  storage.saveTokens({
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    access_expires_in: data.access_expires_in,
    refresh_expires_in: data.refresh_expires_in,
  });

  return data;
}

// ----------- fetchWithAuth: رپری برای fetch -------------

// هر درخواست پروتکت‌شده را با Authorization + DPoP می‌زند و اگر توکن تمام شد، سعی می‌کند رفرش کند و یک بار دیگر درخواست را تکرار می‌کند.
export async function fetchWithAuth(input, init = {}) {
  const tokens = storage.loadTokens();
  const privateJwk = storage.loadPrivateJwk();
  if (!tokens || !tokens.access_token) throw new Error("Not authenticated");

  const url = typeof input === "string" ? input : input.url;
  const fullUrl = url.startsWith("http") ? url : baseUrlCombine(url);

  // public JWK برای هدر DPoP باید ساخته شود  
  const publicJwk = Object.assign({}, privateJwk);
  delete publicJwk.d;
  const method = init.method || "GET";
  const dpop = await createDpop(privateJwk, publicJwk, fullUrl, method);

  const headers = new Headers(init.headers || {});
  headers.set("Authorization", `Bearer ${tokens.access_token}`);
  headers.set("DPoP", dpop);

  let res = await fetch(fullUrl, { ...init, headers });

  // اگر ۴۰۱ برگشت (توکن اکسپایر)، سعی می‌کند refresh کنی و دوباره همان درخواست را تکرار می‌کند
  if (res.status === 401) {
    try {
      await refreshTokens();
    } catch (e) {
      storage.clearTokens();
      storage.clearPrivateJwk();
      throw e;
    }
    // یک بار دیگر با توکن جدید امتحان می‌کند
    const newTokens = storage.loadTokens();
    const newDpop = await createDpop(storage.loadPrivateJwk(), publicJwk, fullUrl, method);
    const retryHeaders = new Headers(init.headers || {});
    retryHeaders.set("Authorization", `Bearer ${newTokens.access_token}`);
    retryHeaders.set("DPoP", newDpop);
    res = await fetch(fullUrl, { ...init, headers: retryHeaders });
  }

  return res;
}

// ----------- خروج (logout) -------------

export function logout() {
  storage.clearTokens();
  storage.clearPrivateJwk();
}

// ------------------------------------------------------------------------------------
// LoginForm.jsx: یک فرم بسیار ساده برای تست لاگین JWT + DPoP فراهم می‌کند.
// هنگام ورود، جفت کلید ساخته می‌شود و توکن‌ها دریافت و ذخیره می‌شوند.

// طریقه مصرف: 
//   ۱- فرم ورود (user + pass) پر کنید و Login را بزنید
//   ۲- با دکمه call protected API، درخواست به یک endpoint امن تست می‌شود
//   ۳- Logout همه چیز را پاک می‌کند

import React, { useState } from "react";
import { login, fetchWithAuth, logout } from "@/pages/logintest";

export default function LoginForm() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [msg, setMsg] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const data = await login({ username: user, password: pass });
      setMsg("ورود موفق! توکن دریافت شد.");
      console.log("login data", data);
    } catch (err) {
      setMsg("خطا در ورود: " + err.message);
    }
  }

  async function callProtectedApi() {
    try {
      const res = await fetchWithAuth("/protected/endpoint", { method: "GET" });
      if (!res.ok) {
        const txt = await res.text();
        setMsg(`خطا از سرور: ${res.status} ${txt}`);
        return;
      }
      const json = await res.json();
      setMsg("داده دریافت شد: " + JSON.stringify(json));
    } catch (e) {
      setMsg("خطا: " + e.message);
    }
  }

  return (
    <div>
      <form onSubmit={handleLogin}>
        <input value={user} onChange={(e) => setUser(e.target.value)} placeholder="username" />
        <input value={pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder="password" />
        <button type="submit">Login</button>
      </form>

      <button onClick={callProtectedApi}>Call protected API</button>
      <button onClick={() => { logout(); setMsg("Logged out"); }}>Logout</button>

      <div>{msg}</div>
    </div>
  );
}
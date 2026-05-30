// src/pages/Settings/Settings.js

import { useEffect, useState } from "react";

import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  deleteUser,
} from "firebase/auth";

import {
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  arrayUnion,
} from "firebase/firestore";

import { auth, db } from "../../firebase";

import { useNavigate } from "react-router-dom";

export default function Settings() {

  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);

  const [address, setAddress] = useState("");

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  useEffect(() => {

    const fetchUser = async () => {

      if (!auth.currentUser) return;

      const ref = doc(
        db,
        "users",
        auth.currentUser.uid
      );

      const snap = await getDoc(ref);

      if (snap.exists()) {

        const data = snap.data();

        setUserData(data);

        setAddress(data.address || "");

      }

    };

    fetchUser();

  }, []);

  // =========================
  // UPDATE ADDRESS
  // =========================
  const saveAddress = async () => {

    try {

      await updateDoc(
        doc(db, "users", auth.currentUser.uid),
        {
          address,
        }
      );

      setMessage("Address updated");

    } catch (error) {

      console.log(error);

    }

  };

  // =========================
  // CHANGE PASSWORD
  // =========================
  const changePassword = async () => {

    try {

      setLoading(true);

      const credential =
        EmailAuthProvider.credential(
          auth.currentUser.email,
          currentPassword
        );

      await reauthenticateWithCredential(
        auth.currentUser,
        credential
      );

      await updatePassword(
        auth.currentUser,
        newPassword
      );

      // ADMIN SECURITY LOG
      if (userData.role === "admin") {

        await updateDoc(
          doc(db, "users", auth.currentUser.uid),
          {
            securityLogs: arrayUnion({
              action: "Password changed",
              createdAt:
                new Date().toISOString(),
            }),
          }
        );

      }

      setMessage("Password updated");

      setCurrentPassword("");
      setNewPassword("");

      setLoading(false);

    } catch (error) {

      setLoading(false);

      console.log(error);

      setMessage(
        "Failed to update password"
      );

    }

  };

  // =========================
  // BECOME VENDOR
  // =========================
  const becomeVendor = async () => {

    try {

      await updateDoc(
        doc(db, "users", auth.currentUser.uid),
        {
          role: "vendor",
        }
      );

      navigate("/vendor-profile");

    } catch (error) {

      console.log(error);

    }

  };

  // =========================
  // DELETE ACCOUNT
  // =========================
  const handleDeleteAccount = async () => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete your account?"
      );

    if (!confirmDelete) return;

    try {

      const credential =
        EmailAuthProvider.credential(
          auth.currentUser.email,
          currentPassword
        );

      await reauthenticateWithCredential(
        auth.currentUser,
        credential
      );

      // DELETE FIRESTORE USER DOC
      await deleteDoc(
        doc(db, "users", auth.currentUser.uid)
      );

      // DELETE AUTH ACCOUNT
      await deleteUser(auth.currentUser);

      navigate("/");

    } catch (error) {

      console.log(error);

      setMessage(
        "Failed to delete account"
      );

    }

  };

  return (

    <div className="min-h-screen bg-[#0b0b0b] text-white px-5 py-10 font-montserrat">

      <div className="max-w-3xl mx-auto">

        {/* HEADER */}
        <div className="mb-10">

          <h1 className="text-3xl font-bric">
            Settings
          </h1>

          <p className="text-white/40 mt-2">
            Manage your account
          </p>

        </div>

        {/* ACCOUNT INFO */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-5">

          <h2 className="text-xl font-semibold mb-5">
            Account
          </h2>

          <div className="space-y-3 text-sm">

            <div>
              <span className="text-white/40">
                Name:
              </span>{" "}
              {userData?.name}
            </div>

            <div>
              <span className="text-white/40">
                Email:
              </span>{" "}
              {userData?.email}
            </div>

            <div>
              <span className="text-white/40">
                UID:
              </span>{" "}
              {userData?.uid}
            </div>

            <div>
              <span className="text-white/40">
                Role:
              </span>{" "}
              {userData?.role}
            </div>

          </div>

        </div>

        {/* ADDRESS */}
        {
          userData?.role === "consumer" && (
            <div className="bg-white/5 border border-white/10 rounded-3xl p-5 mt-6">

              <h2 className="text-xl font-semibold mb-5">
                Address
              </h2>

              <input
                type="text"
                value={address}
                onChange={(e) =>
                  setAddress(e.target.value)
                }
                placeholder="Your address"
                className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 outline-none"
              />

              <button
                onClick={saveAddress}
                className="mt-4 px-6 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 transition"
              >
                Save Address
              </button>

            </div>
          )
        }

        {/* SECURITY */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-5 mt-6">

          <h2 className="text-xl font-semibold mb-5">
            Security
          </h2>

          <div className="space-y-4">

            <input
              type="password"
              placeholder="Current password"
              value={currentPassword}
              onChange={(e) =>
                setCurrentPassword(
                  e.target.value
                )
              }
              className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 outline-none"
            />

            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) =>
                setNewPassword(
                  e.target.value
                )
              }
              className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 outline-none"
            />

            <button
              onClick={changePassword}
              disabled={loading}
              className="w-full p-4 rounded-2xl bg-orange-500 hover:bg-orange-600 transition"
            >
              Change Password
            </button>

          </div>

        </div>

        {/* BECOME VENDOR */}
        {
          userData?.role === "consumer" && (
            <div className="bg-white/5 border border-white/10 rounded-3xl p-5 mt-6">

              <h2 className="text-xl font-semibold">
                Become Vendor
              </h2>

              <p className="text-white/40 text-sm mt-2">
                Start selling on Shoppal
              </p>

              <button
                onClick={becomeVendor}
                className="mt-5 w-full p-4 rounded-2xl bg-green-500 hover:bg-green-600 transition"
              >
                Become Vendor
              </button>

            </div>
          )
        }

        {/* ADMIN SECURITY LOGS */}
        {
          userData?.role === "admin" && (
            <div className="bg-white/5 border border-white/10 rounded-3xl p-5 mt-6">

              <h2 className="text-xl font-semibold mb-5">
                Security Logs
              </h2>

              <div className="space-y-3">

                {
                  userData?.securityLogs?.length > 0
                    ? userData.securityLogs
                        .slice()
                        .reverse()
                        .map((log, index) => (

                          <div
                            key={index}
                            className="bg-black/30 p-4 rounded-2xl border border-white/5"
                          >

                            <div>
                              {log.action}
                            </div>

                            <div className="text-xs text-white/40 mt-1">
                              {
                                new Date(
                                  log.createdAt
                                ).toLocaleString()
                              }
                            </div>

                          </div>

                        ))
                    : (
                      <div className="text-white/40">
                        No security logs
                      </div>
                    )
                }

              </div>

            </div>
          )
        }

{
          message && (
            <div className="mt-6 p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-300">

              {message}

            </div>
          )
        }

        {/* DELETE ACCOUNT */}
        <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-5 mt-6">

          <h2 className="text-xl font-semibold text-red-400">
            Danger Zone
          </h2>

          <p className="text-white/40 text-sm mt-2">
            Permanently delete your account
          </p>


        


          <button
            onClick={handleDeleteAccount}
            className="mt-5 w-full p-4 rounded-2xl bg-red-500 hover:bg-red-600 transition"
          >
            Delete Account
          </button>

        </div>

        {/* MESSAGE */}
       

      </div>

    </div>

  );

}
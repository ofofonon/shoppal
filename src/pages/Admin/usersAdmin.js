import { useEffect, useState } from "react";

import {
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { db } from "../../firebase";

export default function AdminUsers() {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // FETCH USERS
  // =========================
  useEffect(() => {

    const fetchUsers = async () => {

      try {

        const snap = await getDocs(
          collection(db, "users")
        );

        const data = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setUsers(data);

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    };

    fetchUsers();

  }, []);

  // =========================
  // DELETE USER
  // =========================
  const deleteUser = async (userId, role) => {

    // PREVENT ADMIN DELETE
    if (role === "admin") return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this account?"
    );

    if (!confirmDelete) return;

    try {

      await deleteDoc(doc(db, "users", userId));

      setUsers((prev) =>
        prev.filter((user) => user.id !== userId)
      );

    } catch (error) {

      console.log(error);

    }

  };

  return (

    <div className="min-h-screen bg-[#111111] text-white relative overflow-hidden">

      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0">

        <div className="absolute w-[500px] h-[500px] bg-orange-500/10 blur-[120px] top-[-120px] left-[-120px]" />

        <div className="absolute w-[400px] h-[400px] bg-orange-500/5 blur-[120px] bottom-[-120px] right-[-120px]" />

      </div>

      <div className="relative max-w-6xl mx-auto px-5 py-10">

        {/* HEADER */}
        <div className="mb-10">

          <h1 className="text-4xl font-bold">
            Users Management
          </h1>

          <p className="text-white/40 mt-2 font-montserrat">
            View and manage all registered users
          </p>

        </div>

        {/* LOADING */}
        {loading && (

          <div className="text-center py-20 text-white/40">
            Loading users...
          </div>

        )}

        {/* EMPTY */}
        {!loading && users.length === 0 && (

          <div className="flex flex-col items-center justify-center text-center py-24">

            <div className="text-6xl mb-4">
              👥
            </div>

            <h2 className="text-2xl font-semibold">
              No users found
            </h2>

            <p className="text-white/40 mt-2">
              There are currently no registered users.
            </p>

          </div>

        )}

        {/* USERS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {users.map((user) => (

            <div
              key={user.id}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:border-orange-500/30 transition"
            >

              {/* TOP */}
              <div className="flex justify-between items-start">

                {/* LEFT */}
                <div className="flex gap-4">

                  {/* AVATAR */}
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center text-xl font-bold shadow-lg shadow-orange-500/20 flex-shrink-0">

                    {user?.name?.charAt(0)?.toUpperCase() ||
                      user?.email?.charAt(0)?.toUpperCase() ||
                      "U"}

                  </div>

                  {/* INFO */}
                  <div>

                    <h2 className="text-lg font-semibold">
                      {user.name || "Unnamed User"}
                    </h2>

                    <p className="text-white/50 text-sm break-all">
                      {user.email}
                    </p>

                    <div className="flex items-center gap-2 mt-3">

                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.role === "admin"
                          ? "bg-purple-500/20 text-purple-400"
                          : user.role === "vendor"
                          ? "bg-orange-500/20 text-orange-400"
                          : "bg-blue-500/20 text-blue-400"
                      }`}>

                        {user.role || "user"}

                      </span>

                    </div>

                  </div>

                </div>

              </div>

              {/* UID */}
              <div className="mt-5 bg-black/30 rounded-2xl p-4 border border-white/5">

                <p className="text-white/30 text-xs mb-2">
                  USER UID
                </p>

                <p className="text-sm break-all font-mono text-white/70">
                  {user.id}
                </p>

              </div>

              {/* FOOTER */}
              <div className="mt-5 flex justify-between items-center">

                <div className="text-white/30 text-xs">
                  Account Type:{" "}
                  <span className="capitalize">
                    {user.role || "user"}
                  </span>
                </div>

                {/* DELETE */}
                {user.role !== "admin" ? (

                  <button
                    onClick={() =>
                      deleteUser(user.id, user.role)
                    }
                    className="px-5 py-2 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition font-medium"
                  >
                    Delete
                  </button>

                ) : (

                  <div className="px-4 py-2 rounded-2xl bg-white/5 text-white/30 text-sm border border-white/10">
                    Protected
                  </div>

                )}

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>

  );

}
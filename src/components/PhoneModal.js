import { useState } from "react";

export default function PhoneModal({
  closeModal,
  savePhone,
}) {

  const [phone, setPhone] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  const handleSave =
    async () => {

      if (!phone) return;

      setLoading(true);

      await savePhone(phone);

      setLoading(false);

      setSuccess(true);

      setTimeout(() => {
        closeModal();
      }, 1500);

    };

  return (

    <div className="fixed inset-0 z-[200] bg-black/50 flex items-end font-montserrat">

      <div className="w-full bg-[#111] rounded-t-3xl p-6 animate-slideUp">

        <div className="w-16 h-1 bg-white/20 rounded-full mx-auto mb-6" />

        <h2 className="text-2xl font-bold text-white font-bric">
          Add Phone Number
        </h2>

        <p className="text-white/50 mt-2">
          We need your number for
          delivery updates.
        </p>

        <input
          value={phone}
          onChange={(e) =>
            setPhone(
              e.target.value
            )
          }
          placeholder="Enter phone number"
          className="w-full mt-6 p-4 rounded-2xl bg-white/5 text-white outline-none"
        />

        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full mt-4 p-4 rounded-2xl bg-orange-500 text-white font-semibold flex items-center justify-center gap-3"
        >

          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Saving...
            </>
          ) : success ? (
            "Phone Saved ✓"
          ) : (
            "Save Phone Number"
          )}

        </button>

        <button
          onClick={closeModal}
          className="w-full mt-3 p-4 rounded-2xl bg-white/5 text-white"
        >
          Cancel
        </button>

      </div>

    </div>

  );

}
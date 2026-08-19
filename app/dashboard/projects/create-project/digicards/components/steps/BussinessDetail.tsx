"use client";

import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import {
  ChangeEvent,
  useRef,
  useState,
} from "react";

import { useDigitalCard } from "../DigitalCardEditor";

export default function BusinessDetails() {
  const {
    card,
    updateCard,
    saveCard,
    saving,
  } = useDigitalCard();

  const logoInputRef =
    useRef<HTMLInputElement>(null);

  const bannerInputRef =
    useRef<HTMLInputElement>(null);

  const [serviceInput, setServiceInput] =
    useState("");

  const [uploadingLogo, setUploadingLogo] =
    useState(false);

  const [uploadingBanner, setUploadingBanner] =
    useState(false);

  // =====================================================
  // BUSINESS DETAILS
  // =====================================================

  const businessDetails =
    card.businessDetails ?? {
      businessName: "",
      businessType: "",
      gstNumber: "",
      description: "",

      companyLogo: "",
      coverBanner: "",

      services: [],

      workingHours: {
        weekday: {
          from: "09:00 AM",
          to: "07:00 PM",
        },

        weekend: {
          from: "10:00 AM",
          to: "04:00 PM",
        },
      },
    };

  const services =
    businessDetails.services ?? [];

  const workingHours =
    businessDetails.workingHours ?? {
      weekday: {
        from: "09:00 AM",
        to: "07:00 PM",
      },

      weekend: {
        from: "10:00 AM",
        to: "04:00 PM",
      },
    };

  // =====================================================
  // UPDATE BUSINESS DETAILS
  // =====================================================

  const updateBusinessDetails = (
    updates: Partial<
      typeof businessDetails
    >
  ) => {
    updateCard("businessDetails", {
      ...businessDetails,
      ...updates,
    });
  };

  // =====================================================
  // IMAGE UPLOAD
  // =====================================================

  const uploadImage = async (
    file: File,
    type: "logo" | "banner"
  ) => {
    // ---------------------------------------------------
    // SIZE
    // ---------------------------------------------------

    const maxSize =
      type === "logo"
        ? 2 * 1024 * 1024
        : 5 * 1024 * 1024;

    if (file.size > maxSize) {
      alert(
        type === "logo"
          ? "Logo size must be less than 2MB."
          : "Banner size must be less than 5MB."
      );

      return;
    }

    // ---------------------------------------------------
    // TYPE
    // ---------------------------------------------------

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/svg+xml",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert(
        "Only JPG, PNG, WEBP or SVG images are allowed."
      );

      return;
    }

    try {
      if (type === "logo") {
        setUploadingLogo(true);
      } else {
        setUploadingBanner(true);
      }

      // -------------------------------------------------
      // FORM DATA
      // -------------------------------------------------

      const formData = new FormData();

      formData.append("file", file);

      // -------------------------------------------------
      // UPLOAD
      // -------------------------------------------------

      const response = await fetch(
        "/api/digital-cards/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const result =
        await response.json();

      console.log(
        "UPLOAD RESULT:",
        result
      );

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Image upload failed"
        );
      }

      // -------------------------------------------------
      // CHECK URL
      // -------------------------------------------------

      if (
        !result.url ||
        typeof result.url !== "string"
      ) {
        throw new Error(
          "Upload succeeded but server did not return an image URL."
        );
      }

      // -------------------------------------------------
      // SAVE URL IN CARD STATE
      // -------------------------------------------------

      if (type === "logo") {
        updateBusinessDetails({
          companyLogo: result.url,
        });
      } else {
        updateBusinessDetails({
          coverBanner: result.url,
        });
      }

      console.log(
        `${type} URL saved:`,
        result.url
      );
    } catch (error) {
      console.error(
        "IMAGE UPLOAD ERROR:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Image upload failed"
      );
    } finally {
      if (type === "logo") {
        setUploadingLogo(false);
      } else {
        setUploadingBanner(false);
      }
    }
  };

  // =====================================================
  // LOGO
  // =====================================================

  const handleLogoChange = async (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      e.target.files?.[0];

    if (!file) return;

    await uploadImage(
      file,
      "logo"
    );

    e.target.value = "";
  };

  const removeLogo = () => {
    updateBusinessDetails({
      companyLogo: "",
    });
  };

  // =====================================================
  // BANNER
  // =====================================================

  const handleBannerChange = async (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      e.target.files?.[0];

    if (!file) return;

    await uploadImage(
      file,
      "banner"
    );

    e.target.value = "";
  };

  const removeBanner = () => {
    updateBusinessDetails({
      coverBanner: "",
    });
  };

  // =====================================================
  // SERVICES
  // =====================================================

  const addService = () => {
    const value =
      serviceInput.trim();

    if (!value) return;

    if (services.includes(value)) {
      setServiceInput("");
      return;
    }

    updateBusinessDetails({
      services: [
        ...services,
        value,
      ],
    });

    setServiceInput("");
  };

  const removeService = (
    service: string
  ) => {
    updateBusinessDetails({
      services:
        services.filter(
          (item) =>
            item !== service
        ),
    });
  };

  const handleServiceKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();

      addService();
    }
  };

  // =====================================================
  // WORKING HOURS
  // =====================================================

  const updateWorkingHour = (
    type:
      | "weekday"
      | "weekend",

    field:
      | "from"
      | "to",

    value: string
  ) => {
    updateBusinessDetails({
      workingHours: {
        ...workingHours,

        [type]: {
          ...workingHours[type],

          [field]: value,
        },
      },
    });
  };

  // =====================================================
  // GST
  // =====================================================

  const updateGST = (
    value: string
  ) => {
    updateBusinessDetails({
      gstNumber:
        value.toUpperCase(),
    });
  };

  // =====================================================
  // SAVE
  // =====================================================

  const handleSave = async () => {
    try {
      await saveCard();

      alert(
        "Business details saved successfully."
      );
    } catch (error) {
      console.error(
        "SAVE BUSINESS ERROR:",
        error
      );

      alert(
        "Failed to save business details."
      );
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="w-full">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mb-7">
        <h1 className="text-sm font-semibold text-gray-900">
          Step 4 - Business Details
        </h1>

        <p className="mt-1 text-[9px] text-gray-500">
          Add your business information which
          will be shown on your card.
        </p>
      </div>

      {/* =================================================
          COMPANY LOGO
      ================================================= */}

      <div className="mb-7">

        <label className="mb-2 block text-[9px] font-semibold text-gray-700">
          Company Logo
        </label>

        <div className="flex flex-wrap items-center gap-5">

          <div className="flex h-[140px] w-[230px] items-center justify-center rounded-lg border border-gray-200 bg-gray-50">

            {businessDetails.companyLogo ? (

              <div className="relative flex h-[115px] w-[115px] items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

                <img
                  src={
                    businessDetails.companyLogo
                  }
                  alt="Company Logo"
                  className="h-full w-full object-contain p-3"
                />

              </div>

            ) : (

              <div className="flex flex-col items-center justify-center text-gray-400">

                <ImageIcon size={32} />

                <span className="mt-2 text-[9px]">
                  No logo uploaded
                </span>

              </div>
            )}

          </div>

          <div className="flex flex-col gap-2">

            <input
              ref={logoInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/svg+xml"
              className="hidden"
              onChange={
                handleLogoChange
              }
            />

            <button
              type="button"
              disabled={
                uploadingLogo
              }
              onClick={() =>
                logoInputRef.current?.click()
              }
              className="flex min-w-[125px] items-center justify-center gap-2 rounded-md border border-purple-200 bg-white px-4 py-2 text-[9px] font-medium text-purple-600 transition hover:bg-purple-50 disabled:opacity-50"
            >

              <Upload size={12} />

              {uploadingLogo
                ? "Uploading..."
                : businessDetails.companyLogo
                ? "Change Logo"
                : "Upload Logo"}

            </button>

            {businessDetails.companyLogo && (

              <button
                type="button"
                onClick={
                  removeLogo
                }
                className="flex min-w-[125px] items-center justify-center gap-2 rounded-md border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50"
              >

                <Trash2
                  size={15}
                />

                Remove

              </button>

            )}

          </div>

        </div>

        <p className="mt-2 text-[9px] text-gray-400">
          JPG, PNG, WEBP or SVG. Max size 2MB
        </p>

      </div>

      {/* =================================================
          COVER BANNER
      ================================================= */}

      <div className="mb-7">

        <label className="mb-2 block text-[9px] font-semibold text-gray-700">
          Cover Banner
        </label>

        <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50">

          {businessDetails.coverBanner ? (

            <img
              src={
                businessDetails.coverBanner
              }
              alt="Cover Banner"
              className="h-[140px] w-full object-cover"
            />

          ) : (

            <div className="flex h-[140px] items-center justify-center">

              <div className="text-center text-gray-400">

                <ImageIcon
                  size={30}
                  className="mx-auto"
                />

                <p className="mt-2 text-[9px]">
                  No banner uploaded
                </p>

              </div>

            </div>

          )}

        </div>

        <input
          ref={bannerInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/svg+xml"
          className="hidden"
          onChange={
            handleBannerChange
          }
        />

        <div className="mt-2 flex gap-2">

          <button
            type="button"
            disabled={
              uploadingBanner
            }
            onClick={() =>
              bannerInputRef.current?.click()
            }
            className="flex items-center gap-2 rounded-md border border-purple-200 bg-white px-4 py-2 text-[9px] font-medium text-purple-600 transition hover:bg-purple-50 disabled:opacity-50"
          >

            <Upload size={12} />

            {uploadingBanner
              ? "Uploading..."
              : businessDetails.coverBanner
              ? "Change Banner"
              : "Upload Banner"}

          </button>

          {businessDetails.coverBanner && (

            <button
              type="button"
              onClick={
                removeBanner
              }
              className="flex items-center gap-2 rounded-md border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50"
            >

              <Trash2
                size={15}
              />

              Remove

            </button>

          )}

        </div>

        <p className="mt-2 text-[9px] text-gray-400">
          JPG, PNG or WEBP. Recommended size 1200x400px
        </p>

      </div>

      {/* =================================================
          SERVICES
      ================================================= */}

      <div className="mb-7">

        <label className="mb-2 block text-[9px] font-semibold text-gray-700">
          Services / What You Do
        </label>

        <div className="rounded-lg border border-gray-200 bg-white p-2">

          <div className="flex flex-wrap items-center gap-2">

            {services.map(
              (
                service,
                index
              ) => (

                <div
                  key={`${service}-${index}`}
                  className="flex items-center gap-2 rounded-md border border-purple-100 bg-purple-50 px-3 py-1 text-[9px] font-medium text-purple-600"
                >

                  <span>
                    {service}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      removeService(
                        service
                      )
                    }
                    className="text-purple-400 transition hover:text-red-500"
                  >

                    <X size={13} />

                  </button>

                </div>

              )
            )}

            <div className="flex min-w-[150px] flex-1 items-center">

              <input
                type="text"
                value={
                  serviceInput
                }
                onChange={(e) =>
                  setServiceInput(
                    e.target.value
                  )
                }
                onKeyDown={
                  handleServiceKeyDown
                }
                placeholder="Add service"
                className="min-w-0 flex-1 border-0 px-2 py-1 text-[9px] outline-none placeholder:text-gray-400"
              />

              <button
                type="button"
                onClick={
                  addService
                }
                className="flex items-center gap-1 rounded-md border border-purple-200 px-3 py-1.5 text-[9px] font-medium text-purple-600 transition hover:bg-purple-50"
              >

                <Plus size={13} />

                Add Service

              </button>

            </div>

          </div>

        </div>

        <p className="mt-1 text-[9px] text-gray-400">
          Add services that represent your business.
        </p>

      </div>

      {/* =================================================
          WORKING HOURS
      ================================================= */}

      <div className="mb-7">

        <label className="mb-3 block text-[9px] font-semibold text-gray-700">
          Working Hours
        </label>

        <div className="space-y-2">

          <WorkingHourRow
            label="Mon - Fri"
            from={
              workingHours
                .weekday.from
            }
            to={
              workingHours
                .weekday.to
            }
            onFromChange={(
              value
            ) =>
              updateWorkingHour(
                "weekday",
                "from",
                value
              )
            }
            onToChange={(
              value
            ) =>
              updateWorkingHour(
                "weekday",
                "to",
                value
              )
            }
          />

          <WorkingHourRow
            label="Sat - Sun"
            from={
              workingHours
                .weekend.from
            }
            to={
              workingHours
                .weekend.to
            }
            onFromChange={(
              value
            ) =>
              updateWorkingHour(
                "weekend",
                "from",
                value
              )
            }
            onToChange={(
              value
            ) =>
              updateWorkingHour(
                "weekend",
                "to",
                value
              )
            }
          />

        </div>

      </div>

      {/* =================================================
          GST
      ================================================= */}

      <div>

        <label className="mb-2 block text-[9px] font-semibold text-gray-700">

          GST Number

          <span className="font-normal text-gray-400">
            {" "}
            (Optional)
          </span>

        </label>

        <input
          type="text"
          value={
            businessDetails.gstNumber ??
            ""
          }
          onChange={(e) =>
            updateGST(
              e.target.value
            )
          }
          placeholder="10ABCDE1234F1Z5"
          className="w-full rounded-sm border border-gray-200 px-4 py-2 text-[9px] uppercase outline-none transition placeholder:normal-case placeholder:text-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
        />

      </div>

      {/* =================================================
          SAVE
      ================================================= */}

      <div className="mt-8 border-t border-gray-100 pt-5">

        <button
          type="button"
          disabled={saving}
          onClick={
            handleSave
          }
          className="rounded-md bg-purple-600 px-5 py-2 text-[10px] font-semibold text-white transition hover:bg-purple-700 disabled:opacity-50"
        >
          {saving
            ? "Saving..."
            : "Save Business Details"}
        </button>

      </div>

    </div>
  );
}

/* =========================================================
   WORKING HOUR ROW
========================================================= */

function WorkingHourRow({
  label,
  from,
  to,
  onFromChange,
  onToChange,
}: {
  label: string;
  from: string;
  to: string;
  onFromChange: (
    value: string
  ) => void;
  onToChange: (
    value: string
  ) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-[140px_1fr_auto_1fr] sm:items-center">

      <div className="rounded-sm border border-purple-100 bg-purple-50 px-4 py-2 text-center text-[9px] font-semibold text-purple-600">
        {label}
      </div>

      <TimeInput
        value={from}
        onChange={
          onFromChange
        }
      />

      <span className="hidden text-center text-[9px] font-medium text-gray-500 sm:block">
        to
      </span>

      <TimeInput
        value={to}
        onChange={
          onToChange
        }
      />

    </div>
  );
}

/* =========================================================
   TIME INPUT
========================================================= */

function TimeInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (
    value: string
  ) => void;
}) {
  return (
    <input
      type="time"
      value={convertTo24Hour(
        value
      )}
      onChange={(e) =>
        onChange(
          convertTo12Hour(
            e.target.value
          )
        )
      }
      className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-[9px] text-gray-700 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
    />
  );
}

/* =========================================================
   TIME HELPERS
========================================================= */

function convertTo24Hour(
  time: string
) {
  if (!time) return "";

  const match =
    time.match(
      /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i
    );

  if (!match) {
    return time;
  }

  let hours = Number(
    match[1]
  );

  const minutes =
    match[2];

  const period =
    match[3].toUpperCase();

  if (
    period === "AM" &&
    hours === 12
  ) {
    hours = 0;
  }

  if (
    period === "PM" &&
    hours !== 12
  ) {
    hours += 12;
  }

  return `${String(
    hours
  ).padStart(
    2,
    "0"
  )}:${minutes}`;
}

function convertTo12Hour(
  time: string
) {
  if (!time) return "";

  const [
    hourString,
    minutes,
  ] = time.split(":");

  let hours =
    Number(hourString);

  const period =
    hours >= 12
      ? "PM"
      : "AM";

  hours =
    hours % 12;

  if (hours === 0) {
    hours = 12;
  }

  return `${String(
    hours
  ).padStart(
    2,
    "0"
  )}:${minutes} ${period}`;
}
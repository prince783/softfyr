"use client";

import { useRef } from "react";
import { Camera } from "lucide-react";
import { useDigitalCard } from "../DigitalCardEditor";

export default function BasicDetails() {
  const { card, updateCard } = useDigitalCard();

  const fileInputRef = useRef<HTMLInputElement>(null);

  /* =====================================================
     PROFILE PHOTO
  ====================================================== */

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Maximum 2MB
    if (file.size > 2 * 1024 * 1024) {
      alert("Image size must be less than 2MB");
      return;
    }

    // Allowed formats
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      alert("Please upload JPG, PNG or WEBP image");
      return;
    }

    const imageUrl = URL.createObjectURL(file);

    updateCard("profilePhoto", imageUrl);
  };

  const profilePhoto = card.profilePhoto || (
    <div className="flex h-full w-full items-center justify-center rounded-full bg-[#e9cbb5] text-[25px]">
      👤
    </div>
  );

  return (
    <div>
      {/* =================================================
          HEADER
      ================================================== */}

      <div className="mb-7">
        <h1 className="text-[15px] font-semibold leading-[20px] text-[#222]">
          Step 1 - Basic Details
        </h1>

        <p className="mt-[5px] text-[9px] leading-[14px] text-[#858585]">
          Add your basic information which will be shown on your card.
        </p>
      </div>

      {/* =================================================
          FORM
      ================================================== */}

      <div className="space-y-[18px]">
        {/* =================================================
            TOP SECTION

            LEFT:
            Full Name
            Company Name
            Designation

            RIGHT:
            Profile Photo
        ================================================== */}

        <div className="grid grid-cols-[minmax(0,1fr)_125px] gap-6">
          {/* =================================================
              LEFT SIDE
          ================================================== */}

          <div className="space-y-[18px]">
            {/* FULL NAME */}

            <Input
              label="Full Name"
              required
              value={card.fullName}
              onChange={(value) => updateCard("fullName", value)}
              placeholder="Enter full name"
            />

            {/* COMPANY NAME */}

            <Input
              label="Company Name"
              required
              value={card.companyName}
              onChange={(value) => updateCard("companyName", value)}
              placeholder="Enter company name"
            />

            {/* DESIGNATION */}

            <Input
              label="Designation"
              required
              value={card.designation}
              onChange={(value) => updateCard("designation", value)}
              placeholder="Founder & CEO"
            />
          </div>

          {/* =================================================
              RIGHT SIDE - PROFILE PHOTO
          ================================================== */}

          <div>
            <label className="block text-[9px] font-medium text-[#454545]">
              Profile Photo <span className="text-[#e63946]">*</span>
            </label>

            {/* PHOTO BOX */}

            <div className="mt-[7px] flex justify-start">
              <div className="relative flex h-[94px] w-[94px] items-center justify-center rounded-[6px] border border-dashed border-[#dcdcdc] bg-white">
                {/* PROFILE IMAGE */}

                <div className="h-[70px] w-[70px] overflow-hidden rounded-full bg-[#f1d6c0]">
                  {card.profilePhoto ? (
                    <img
                      src={card.profilePhoto}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[25px]">
                      👤
                    </div>
                  )}
                </div>

                {/* CAMERA BUTTON */}

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-[3px] right-[2px] flex h-[20px] w-[20px] items-center justify-center rounded-full border border-white bg-white shadow-sm transition hover:bg-[#f5f3ff]"
                  aria-label="Change profile photo"
                >
                  <Camera size={10} strokeWidth={2} className="text-[#555]" />
                </button>
              </div>
            </div>

            {/* HIDDEN FILE INPUT */}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handlePhotoChange}
              className="hidden"
            />

            {/* CHANGE PHOTO */}

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-[6px] block text-[9px] font-medium text-[#6335e9] hover:underline"
            >
              Change Photo
            </button>

            {/* HELP TEXT */}

            <p className="mt-[2px] text-[7px] leading-[10px] text-[#8b8b8b]">
              JPG, PNG or WEBP.
              <br />
              Max size 2MB
            </p>
          </div>
        </div>

        {/* =================================================
            TAGLINE
        ================================================== */}

        <Input
          label="Tagline"
          required
          value={card.tagline}
          onChange={(value) => updateCard("tagline", value)}
          placeholder="Empowering Brands with Digital Solutions"
        />

        {/* =================================================
            ABOUT COMPANY
        ================================================== */}

        <div>
          <label className="block text-[9px] font-medium text-[#454545]">
            About Company <span className="text-[#e63946]">*</span>
          </label>

          <textarea
            rows={4}
            maxLength={500}
            value={card.aboutCompany}
            onChange={(e) => updateCard("aboutCompany", e.target.value)}
            placeholder="Write about your company..."
            className="mt-[7px] w-full resize-none rounded-[5px] border border-[#dedede] bg-white px-[8px] py-[7px] text-[9px] leading-[14px] text-[#454545] outline-none transition placeholder:text-[#a1a1a1] focus:border-[#6335e9] focus:ring-[2px] focus:ring-[#6335e9]/10"
          />

          {/* CHARACTER COUNT */}

          <div className="mt-[3px] flex justify-end">
            <span className="text-[7px] text-[#858585]">
              {card.aboutCompany?.length || 0} / 500
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   INPUT COMPONENT
========================================================= */

function Input({
  label,
  required,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-[9px] font-medium text-[#454545]">
        {label}

        {required && <span className="ml-1 text-[#e63946]">*</span>}
      </label>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-[7px] h-[27px] w-full rounded-[5px] border border-[#dedede] bg-white px-[8px] text-[9px] text-[#454545] outline-none transition placeholder:text-[#a1a1a1] focus:border-[#6335e9] focus:ring-[2px] focus:ring-[#6335e9]/10"
      />
    </div>
  );
}

"use client";

import {
  Phone,
  MessageCircle,
  Mail,
  Globe,
  MapPin,
  Map,
} from "lucide-react";

import { useDigitalCard } from "../DigitalCardEditor";

export default function Contact() {
  const {
    card,
    updateCard,
  } = useDigitalCard();

  return (
    <div>

      {/* HEADER */}

      <div className="mb-8">

        <h1 className="text-sm font-semibold">
          Step 2 - Contact Details
        </h1>

        <p className="mt-1 text-[9px] text-gray-500">
          Add your contact information which
          will be shown on your card.
        </p>

      </div>

      <div className="space-y-3">

        {/* MOBILE */}

        <ContactInput
          icon={<Phone size={15} />}
          label="Mobile Number"
          required
          value={card.mobile}
          onChange={(value) =>
            updateCard(
              "mobile",
              value
            )
          }
          placeholder="+91 87091 22663"
        />

        {/* WHATSAPP */}

        <ContactInput
          icon={
            <MessageCircle size={15} />
          }
          label="WhatsApp Number"
          value={card.whatsapp}
          onChange={(value) =>
            updateCard(
              "whatsapp",
              value
            )
          }
          placeholder="+91 87091 22663"
        />

        {/* EMAIL */}

        <ContactInput
          icon={<Mail size={15} />}
          label="Email Address"
          required
          type="email"
          value={card.email}
          onChange={(value) =>
            updateCard(
              "email",
              value
            )
          }
          placeholder="info@softfyr.com"
        />

        {/* WEBSITE */}

        <ContactInput
          icon={<Globe size={15} />}
          label="Website"
          type="url"
          value={card.website}
          onChange={(value) =>
            updateCard(
              "website",
              value
            )
          }
          placeholder="https://softfyr.com"
        />

        {/* ADDRESS */}

        <div>

          <label className="mb-2 block text-[9px] font-medium">
            Address
          </label>

          <div className="relative">

            <MapPin
              size={15}
              className="absolute left-4 top-4 text-purple-500"
            />

            <textarea
              rows={2}
              value={card.address}
              onChange={(e) =>
                updateCard(
                  "address",
                  e.target.value
                )
              }
              placeholder="Enter complete address"
              className="w-full resize-none rounded-lg border border-gray-200 py-3 pl-11 pr-4 text-[9px] outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
            />

          </div>

        </div>

        {/* GOOGLE MAP */}

        <ContactInput
          icon={<Map size={15} />}
          label="Google Map Link"
          type="url"
          value={card.googleMapLink}
          onChange={(value) =>
            updateCard(
              "googleMapLink",
              value
            )
          }
          placeholder="https://maps.app.goo.gl/..."
        />

      </div>

    </div>
  );
}

function ContactInput({
  icon,
  label,
  required,
  type = "text",
  value,
  onChange,
  placeholder,
}: {
  icon: React.ReactNode;
  label: string;
  required?: boolean;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>

      <label className="mb-2 block text-[9px] font-medium">
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      <div className="relative">

        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500">
          {icon}
        </span>

        <input
          type={type}
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          placeholder={placeholder}
          className="w-full rounded-lg border border-gray-200 py-2 pl-11 pr-4 text-[9px] outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
        />

      </div>

    </div>
  );
}
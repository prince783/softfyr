"use client";

import { useRef, useState } from "react";
import {
  Image as ImageIcon,
  Plus,
  X,
  Play,
  Trash2,
  FileText,
  Upload,
} from "lucide-react";

import { useDigitalCard } from "../DigitalCardEditor";

/* =========================================================
   TYPES
========================================================= */

interface GalleryImage {
  url: string;
}

interface GalleryVideo {
  id: string;
  url: string;
  platform: "youtube" | "vimeo";
}

interface Certificate {
  id: string;
  name: string;
  size: number;
  url: string;
}

/* =========================================================
   COMPONENT
========================================================= */

export default function Gallery() {
  const { card, updateCard } = useDigitalCard();

  const imageInputRef = useRef<HTMLInputElement>(null);
  const certificateInputRef =
    useRef<HTMLInputElement>(null);

  const [videos, setVideos] = useState<GalleryVideo[]>(
    card.videos ?? []
  );

  const [certificates, setCertificates] =
    useState<Certificate[]>(
      card.certificates ?? []
    );

  /* =========================================================
     IMAGE UPLOAD
  ========================================================= */

const handleImageUpload = async (
  event: React.ChangeEvent<HTMLInputElement>
) => {
  const files = Array.from(
    event.target.files || []
  );

  if (!files.length) return;

  try {
    const currentImages = card.gallery ?? [];

    const remainingSlots =
      12 - currentImages.length;

    if (remainingSlots <= 0) {
      alert("You can upload up to 12 images.");
      return;
    }

    const selectedFiles =
      files
        .filter((file) =>
          file.type.startsWith("image/")
        )
        .slice(0, remainingSlots);

    const uploadedImages: {
      url: string;
      name: string;
    }[] = [];

    for (const file of selectedFiles) {
      const formData = new FormData();

      formData.append("file", file);

      const response = await fetch(
        "/api/digital-cards/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      console.log(
        "IMAGE UPLOAD RESPONSE:",
        response.status,
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to upload image"
        );
      }

      if (!data.url) {
        throw new Error(
          "Upload URL was not returned"
        );
      }

      uploadedImages.push({
        url: data.url,
        name: file.name,
      });
    }

    /* =================================================
       UPDATE MONGODB
    ================================================= */

    const updatedGallery = [
      ...currentImages,
      ...uploadedImages,
    ];

    await updateCard(
      "gallery",
      updatedGallery
    );

    console.log(
      "GALLERY SAVED:",
      updatedGallery
    );
  } catch (error) {
    console.error(
      "IMAGE UPLOAD ERROR:",
      error
    );

    alert(
      error instanceof Error
        ? error.message
        : "Failed to upload image"
    );
  } finally {
    event.target.value = "";
  }
};

  /* =========================================================
     REMOVE IMAGE
  ========================================================= */

  const removeImage = async (
    index: number
  ) => {
    const updatedGallery = [
      ...(card.gallery ?? []),
    ];

    updatedGallery.splice(index, 1);

    await updateCard(
      "gallery",
      updatedGallery
    );
  };

  /* =========================================================
     ADD VIDEO
  ========================================================= */

  const addVideo = async () => {
    const newVideo: GalleryVideo = {
      id: crypto.randomUUID(),
      url: "",
      platform: "youtube",
    };

    const updatedVideos = [
      ...videos,
      newVideo,
    ];

    setVideos(updatedVideos);

    await updateCard(
      "videos",
      updatedVideos
    );
  };

  /* =========================================================
     DETECT VIDEO PLATFORM
  ========================================================= */

  const detectPlatform = (
    url: string
  ): "youtube" | "vimeo" => {
    const lowerUrl =
      url.toLowerCase();

    if (
      lowerUrl.includes("vimeo.com")
    ) {
      return "vimeo";
    }

    return "youtube";
  };

  /* =========================================================
     UPDATE VIDEO
  ========================================================= */

  const updateVideo = async (
    id: string,
    url: string
  ) => {
    const updatedVideos =
      videos.map((video) =>
        video.id === id
          ? {
              ...video,
              url,
              platform:
                detectPlatform(url),
            }
          : video
      );

    setVideos(updatedVideos);

    await updateCard(
      "videos",
      updatedVideos
    );
  };

  /* =========================================================
     REMOVE VIDEO
  ========================================================= */

  const removeVideo = async (
    id: string
  ) => {
    const updatedVideos =
      videos.filter(
        (video) =>
          video.id !== id
      );

    setVideos(updatedVideos);

    await updateCard(
      "videos",
      updatedVideos
    );
  };

  /* =========================================================
     CERTIFICATE UPLOAD
  ========================================================= */

const handleCertificateUpload = async (
  event: React.ChangeEvent<HTMLInputElement>
) => {
  const files = Array.from(
    event.target.files || []
  );

  if (!files.length) return;

  try {
    const currentCertificates =
      card.certificates ?? [];

    const uploadedCertificates: Certificate[] = [];

    for (const file of files) {
      /* =================================================
         PDF ONLY
      ================================================= */

      if (file.type !== "application/pdf") {
        continue;
      }

      /* =================================================
         FORM DATA
      ================================================= */

      const formData = new FormData();

      formData.append("file", file);

      /* =================================================
         UPLOAD
      ================================================= */

      const response = await fetch(
        "/api/digital-cards/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      console.log(
        "PDF UPLOAD RESPONSE:",
        response.status,
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to upload certificate"
        );
      }

      if (!data.url) {
        throw new Error(
          "Certificate URL was not returned"
        );
      }

      /* =================================================
         CREATE CERTIFICATE OBJECT
      ================================================= */

      uploadedCertificates.push({
        id: crypto.randomUUID(),
        name: file.name,
        size: file.size,
        url: data.url,
      });
    }

    if (!uploadedCertificates.length) {
      alert("Please select a valid PDF file.");
      return;
    }

    /* =================================================
       UPDATE MONGODB
    ================================================= */

    const updatedCertificates = [
      ...currentCertificates,
      ...uploadedCertificates,
    ];

    setCertificates(
      updatedCertificates
    );

    await updateCard(
      "certificates",
      updatedCertificates
    );

    console.log(
      "CERTIFICATES SAVED:",
      updatedCertificates
    );
  } catch (error) {
    console.error(
      "CERTIFICATE UPLOAD ERROR:",
      error
    );

    alert(
      error instanceof Error
        ? error.message
        : "Failed to upload certificate"
    );
  } finally {
    event.target.value = "";
  }
};

  /* =========================================================
     REMOVE CERTIFICATE
  ========================================================= */

  const removeCertificate = async (
    id: string
  ) => {
    const updatedCertificates =
      certificates.filter(
        (certificate) =>
          certificate.id !== id
      );

    setCertificates(
      updatedCertificates
    );

    await updateCard(
      "certificates",
      updatedCertificates
    );
  };

  /* =========================================================
     FILE SIZE
  ========================================================= */

  const formatFileSize = (
    bytes: number
  ) => {
    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (
      bytes <
      1024 * 1024
    ) {
      return `${(
        bytes / 1024
      ).toFixed(1)} KB`;
    }

    return `${(
      bytes /
      (1024 * 1024)
    ).toFixed(1)} MB`;
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="w-full space-y-8">

      {/* =====================================================
          TITLE
      ===================================================== */}

      <div>
        <h2 className="text-sm font-semibold text-gray-900">
          Step 5 - Portfolio / Gallery
        </h2>

        <p className="mt-1 text-[9px] text-gray-500">
          Showcase your work, products, images
          or achievements on your card.
        </p>
      </div>

      {/* =====================================================
          GALLERY / IMAGES
      ===================================================== */}

      <section>
        <div className="flex items-start justify-between">

          <div>
            <h3 className="text-[12px] font-semibold text-gray-900">
              Gallery / Images
            </h3>

            <p className="mt-1 text-[9px] text-gray-500">
              Upload images to showcase your
              work or products.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              imageInputRef.current?.click()
            }
            disabled={
              (card.gallery?.length ?? 0) >=
              12
            }
            className="
              flex
              items-center
              gap-1
              text-[11px]
              font-medium
              text-purple-600
              hover:text-purple-700
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            <Plus size={13} />
            Add New
          </button>

          <input
            ref={imageInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/svg+xml"
            multiple
            hidden
            onChange={
              handleImageUpload
            }
          />
        </div>

        {/* IMAGE GRID */}

        {(card.gallery?.length ?? 0) > 0 ? (
          <div className="mt-4 grid grid-cols-4 gap-3">

            {card.gallery.map(
              (image, index) => (
                <div
                  key={`${image.url}-${index}`}
                  className="
                    group
                    relative
                    h-[105px]
                    overflow-hidden
                    rounded-lg
                    border
                    border-gray-200
                    bg-gray-100
                  "
                >
                  <img
                    src={image.url}
                    alt={`Gallery ${
                      index + 1
                    }`}
                    className="
                      h-full
                      w-full
                      object-cover
                    "
                    onError={(e) => {
                      console.error(
                        "IMAGE LOAD ERROR:",
                        image.url
                      );

                      e.currentTarget.style.display =
                        "none";
                    }}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      removeImage(index)
                    }
                    className="
                      absolute
                      right-1
                      top-1
                      flex
                      h-5
                      w-5
                      items-center
                      justify-center
                      rounded-full
                      bg-white
                      text-gray-600
                      shadow
                      hover:bg-red-50
                      hover:text-red-500
                    "
                  >
                    <X size={12} />
                  </button>
                </div>
              )
            )}

          </div>
        ) : (
          <div
            onClick={() =>
              imageInputRef.current?.click()
            }
            className="
              mt-4
              flex
              h-[120px]
              cursor-pointer
              flex-col
              items-center
              justify-center
              rounded-lg
              border
              border-dashed
              border-gray-300
              bg-gray-50
              hover:border-purple-400
              hover:bg-purple-50/30
            "
          >
            <ImageIcon
              size={25}
              className="text-gray-400"
            />

            <p className="mt-2 text-[9px] text-gray-500">
              Click to upload images
            </p>
          </div>
        )}

        <p className="mt-3 text-[9px] text-gray-400">
          Recommended size 1200x800px.
          Maximum 12 images.
        </p>
      </section>

      {/* =====================================================
          VIDEOS
      ===================================================== */}

      <section>
        <div className="flex items-start justify-between">

          <div>
            <h3 className="text-[12px] font-semibold text-gray-900">
              Videos (YouTube / Vimeo)
            </h3>

            <p className="mt-1 text-[9px] text-gray-500">
              Add videos to showcase your
              work or introduction.
            </p>
          </div>

          <button
            type="button"
            onClick={addVideo}
            className="
              flex
              items-center
              gap-1
              text-[9px]
              font-medium
              text-purple-600
              hover:text-purple-700
            "
          >
            <Plus size={13} />
            Add New
          </button>
        </div>

        <div className="mt-3 space-y-2">

          {videos.length === 0 ? (
            <div
              className="
                rounded-lg
                border
                border-dashed
                border-gray-300
                bg-gray-50
                px-4
                py-4
                text-center
              "
            >
              <Play
                size={20}
                className="mx-auto text-gray-400"
              />

              <p className="mt-1 text-[10px] text-gray-500">
                Add YouTube or Vimeo videos
              </p>
            </div>
          ) : (
            videos.map(
              (video) => (
                <div
                  key={video.id}
                  className="flex items-center gap-2"
                >
                  <div
                    className="
                      flex
                      h-[38px]
                      w-[38px]
                      shrink-0
                      items-center
                      justify-center
                      rounded-md
                      border
                      border-gray-200
                      bg-gray-50
                    "
                  >
                    <Play
                      size={15}
                      className="text-gray-600"
                    />
                  </div>

                  <input
                    type="url"
                    value={video.url}
                    onChange={(e) =>
                      updateVideo(
                        video.id,
                        e.target.value
                      )
                    }
                    placeholder="https://www.youtube.com/watch?v=abc123"
                    className="
                      h-[38px]
                      flex-1
                      rounded-md
                      border
                      border-gray-200
                      bg-white
                      px-3
                      text-[11px]
                      text-gray-700
                      outline-none
                      focus:border-purple-500
                      focus:ring-2
                      focus:ring-purple-100
                    "
                  />

                  <button
                    type="button"
                    onClick={() =>
                      removeVideo(
                        video.id
                      )
                    }
                    className="
                      flex
                      h-[38px]
                      w-[38px]
                      shrink-0
                      items-center
                      justify-center
                      rounded-md
                      border
                      border-gray-200
                      text-red-500
                      hover:bg-red-50
                    "
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              )
            )
          )}

        </div>
      </section>

      {/* =====================================================
          CERTIFICATES
      ===================================================== */}

      <section>
        <div className="flex items-start justify-between">

          <div>
            <h3 className="text-[13px] font-semibold text-gray-900">
              Achievements / Certificates
            </h3>

            <p className="mt-1 text-[11px] text-gray-500">
              Upload certificates or achievements
              (optional).
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              certificateInputRef.current?.click()
            }
            className="
              flex
              items-center
              gap-1
              text-[11px]
              font-medium
              text-purple-600
              hover:text-purple-700
            "
          >
            <Plus size={13} />
            Add New
          </button>

          <input
            ref={certificateInputRef}
            type="file"
            accept="application/pdf"
            multiple
            hidden
            onChange={
              handleCertificateUpload
            }
          />
        </div>

        <div className="mt-3 space-y-2">

          {certificates.length === 0 ? (
            <div
              onClick={() =>
                certificateInputRef.current?.click()
              }
              className="
                flex
                cursor-pointer
                items-center
                justify-center
                gap-2
                rounded-lg
                border
                border-dashed
                border-gray-300
                bg-gray-50
                px-4
                py-5
                hover:border-purple-400
                hover:bg-purple-50/30
              "
            >
              <Upload
                size={18}
                className="text-gray-400"
              />

              <span className="text-[10px] text-gray-500">
                Upload PDF certificates
              </span>
            </div>
          ) : (
            certificates.map(
              (certificate) => (
                <div
                  key={certificate.id}
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-lg
                    border
                    border-gray-200
                    bg-white
                    px-3
                    py-2
                  "
                >
                  <div
                    className="
                      flex
                      h-[34px]
                      w-[34px]
                      shrink-0
                      items-center
                      justify-center
                      rounded-md
                      bg-red-50
                      text-red-500
                    "
                  >
                    <FileText size={17} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[11px] font-medium text-gray-700">
                      {certificate.name}
                    </p>

                    <p className="mt-[2px] text-[9px] text-gray-400">
                      {formatFileSize(
                        certificate.size
                      )}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      removeCertificate(
                        certificate.id
                      )
                    }
                    className="
                      text-gray-400
                      hover:text-red-500
                    "
                  >
                    <X size={14} />
                  </button>
                </div>
              )
            )
          )}

        </div>
      </section>
    </div>
  );
}
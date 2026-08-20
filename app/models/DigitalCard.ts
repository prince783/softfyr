import mongoose, {
  Schema,
  Document,
  Model,
} from "mongoose";

/* =====================================
   GALLERY TYPES
===================================== */

export interface IGalleryItem {
  url: string;
  publicId?: string;
  name?: string;
}

export interface IVideoItem {
  id?: string;
  url: string;
  platform: "youtube" | "vimeo";
}

export interface ICertificateItem {
  id: string;
  url: string;
  publicId?: string;
  name: string;
  size: number;
}

/* =====================================
   PAYMENT TYPES
===================================== */

export type PaymentStatus =
  | "pending"
  | "paid"
  | "failed";

/* =====================================
   DIGITAL CARD
===================================== */

export interface IDigitalCard extends Document {
  userId?: string | null;

  /* =====================================
     USERNAME / PUBLIC URL
  ====================================== */

  username?: string;

  /* =====================================
     BASIC DETAILS
  ====================================== */

  fullName: string;
  companyName: string;
  designation: string;

  profilePhoto: string;

  tagline: string;
  aboutCompany: string;

  /* =====================================
     CONTACT DETAILS
  ====================================== */

  mobile: string;
  whatsapp: string;
  email: string;
  website: string;
  address: string;
  googleMapLink: string;

  /* =====================================
     BUSINESS DETAILS
  ====================================== */

  businessDetails: {
    businessName: string;
    businessType: string;
    gstNumber: string;
    description: string;

    companyLogo: string;
    coverBanner: string;

    services: string[];

    workingHours: {
      weekday: {
        from: string;
        to: string;
      };

      weekend: {
        from: string;
        to: string;
      };
    };
  };

  /* =====================================
     SOCIAL LINKS
  ====================================== */

  socialLinks: {
    facebook: string;
    instagram: string;
    linkedin: string;
    twitter: string;
    youtube: string;
    telegram: string;
    other: string;
  };

  /* =====================================
     GALLERY / PORTFOLIO
  ====================================== */

  gallery: IGalleryItem[];

  /* =====================================
     VIDEOS
  ====================================== */

  videos: IVideoItem[];

  /* =====================================
     CERTIFICATES
  ====================================== */

  certificates: ICertificateItem[];

  /* =====================================
     CARD DESIGN
  ====================================== */

  backgroundColor: string;

  /* =====================================
     PAYMENT
  ====================================== */

  paymentStatus: PaymentStatus;

  paymentId: string | null;

  paidAt: Date | null;

  /* =====================================
     PUBLICATION
  ====================================== */

  isPublished: boolean;

  createdAt: Date;
  updatedAt: Date;
}

/* =====================================
   GALLERY ITEM SCHEMA
===================================== */

const GalleryItemSchema =
  new Schema<IGalleryItem>(
    {
      url: {
        type: String,
        required: true,
        trim: true,
      },

      publicId: {
        type: String,
        default: "",
      },

      name: {
        type: String,
        default: "",
        trim: true,
      },
    },
    {
      _id: false,
    }
  );

/* =====================================
   VIDEO ITEM SCHEMA
===================================== */

const VideoItemSchema =
  new Schema<IVideoItem>(
    {
      id: {
        type: String,
        default: "",
      },

      url: {
        type: String,
        required: true,
        trim: true,
      },

      platform: {
        type: String,
        enum: ["youtube", "vimeo"],
        default: "youtube",
      },
    },
    {
      _id: false,
    }
  );

/* =====================================
   CERTIFICATE ITEM SCHEMA
===================================== */

const CertificateItemSchema =
  new Schema<ICertificateItem>(
    {
      id: {
        type: String,
        required: true,
        trim: true,
      },

      url: {
        type: String,
        required: true,
        trim: true,
      },

      publicId: {
        type: String,
        default: "",
      },

      name: {
        type: String,
        required: true,
        trim: true,
      },

      size: {
        type: Number,
        default: 0,
      },
    },
    {
      _id: false,
    }
  );

/* =====================================
   DIGITAL CARD SCHEMA
===================================== */

const DigitalCardSchema =
  new Schema<IDigitalCard>(
    {
      /* =====================================
         USER
      ====================================== */

      userId: {
        type: String,
        default: null,
        index: true,
      },

      /* =====================================
         USERNAME / PUBLIC CARD URL
         
         Example:
         /digitalvisitingcard/pruyymn
      ====================================== */

      username: {
        type: String,
         required: [true, "Username is required"],


        unique: true,
        sparse: true,

        lowercase: true,
        trim: true,

        minlength: 3,
        maxlength: 30,

        match: /^[a-z0-9_-]{3,30}$/,

        index: true,
      },

      /* =====================================
         BASIC DETAILS
      ====================================== */

      fullName: {
        type: String,
        default: "",
        trim: true,
      },

      companyName: {
        type: String,
        default: "",
        trim: true,
      },

      designation: {
        type: String,
        default: "",
        trim: true,
      },

      profilePhoto: {
        type: String,
        default: "",
      },

      tagline: {
        type: String,
        default: "",
        trim: true,
      },

      aboutCompany: {
        type: String,
        default: "",
      },

      /* =====================================
         CONTACT DETAILS
      ====================================== */

      mobile: {
        type: String,
        default: "",
        trim: true,
      },

      whatsapp: {
        type: String,
        default: "",
        trim: true,
      },

      email: {
        type: String,
        default: "",
        trim: true,
      },

      website: {
        type: String,
        default: "",
        trim: true,
      },

      address: {
        type: String,
        default: "",
      },

      googleMapLink: {
        type: String,
        default: "",
      },

      /* =====================================
         BUSINESS DETAILS
      ====================================== */

      businessDetails: {
        businessName: {
          type: String,
          default: "",
          trim: true,
        },

        businessType: {
          type: String,
          default: "",
          trim: true,
        },

        gstNumber: {
          type: String,
          default: "",
          trim: true,
          uppercase: true,
        },

        description: {
          type: String,
          default: "",
        },

        companyLogo: {
          type: String,
          default: "",
        },

        coverBanner: {
          type: String,
          default: "",
        },

        services: {
          type: [String],
          default: [],
        },

        workingHours: {
          weekday: {
            from: {
              type: String,
              default: "09:00 AM",
            },

            to: {
              type: String,
              default: "07:00 PM",
            },
          },

          weekend: {
            from: {
              type: String,
              default: "10:00 AM",
            },

            to: {
              type: String,
              default: "04:00 PM",
            },
          },
        },
      },

      /* =====================================
         SOCIAL LINKS
      ====================================== */

      socialLinks: {
        facebook: {
          type: String,
          default: "",
        },

        instagram: {
          type: String,
          default: "",
        },

        linkedin: {
          type: String,
          default: "",
        },

        twitter: {
          type: String,
          default: "",
        },

        youtube: {
          type: String,
          default: "",
        },

        telegram: {
          type: String,
          default: "",
        },

        other: {
          type: String,
          default: "",
        },
      },

      /* =====================================
         GALLERY / PORTFOLIO
      ====================================== */

      gallery: {
        type: [GalleryItemSchema],
        default: [],
      },

      /* =====================================
         VIDEOS
      ====================================== */

      videos: {
        type: [VideoItemSchema],
        default: [],
      },

      /* =====================================
         CERTIFICATES
      ====================================== */

      certificates: {
        type: [CertificateItemSchema],
        default: [],
      },

      /* =====================================
         CARD DESIGN
      ====================================== */

      backgroundColor: {
        type: String,
        default: "#17142E",
      },

      /* =====================================
         PAYMENT STATUS
         
         pending = created but not paid
         paid    = payment verified
         failed  = payment failed
      ====================================== */

      paymentStatus: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending",
        index: true,
      },

      /* =====================================
         PAYMENT ID
         
         Example:
         Razorpay payment ID
      ====================================== */

      paymentId: {
        type: String,
        default: null,
      },

      /* =====================================
         PAYMENT DATE
      ====================================== */

      paidAt: {
        type: Date,
        default: null,
      },

      /* =====================================
         PUBLIC CARD STATUS
         
         false = card is not publicly accessible
         true  = card can be accessed using username
      ====================================== */

      isPublished: {
        type: Boolean,
        default: false,
        index: true,
      },
    },

    {
      timestamps: true,
      collection: "digitalcards",
    }
  );

/* =====================================
   MODEL
===================================== */

const DigitalCard: Model<IDigitalCard> =
  mongoose.models.DigitalCard ||
  mongoose.model<IDigitalCard>(
    "DigitalCard",
    DigitalCardSchema
  );

export default DigitalCard;
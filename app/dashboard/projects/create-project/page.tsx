"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Circle,
  CreditCard,
  FileText,
  UserRound,
  Sun,
  Bell,
  ChevronDown,
} from "lucide-react";

type ProjectType = "visiting-card" | "resume" | "biography";

const projectTypes = [
  {
    id: "visiting-card" as ProjectType,
    title: "Digital Visiting Card",
    description:
      "Create your professional digital identity and share instantly.",
    icon: CreditCard,
    iconColor: "#7254e8",
    iconBg: "#f0eaff",
    border: "#7254e8",
    features: [
      "Contact details",
      "Social media links",
      "Services / Business info",
      "Gallery (Images & Videos)",
      "QR Code & Shareable link",
      "Beautiful themes & templates",
    ],
  },
  {
    id: "resume" as ProjectType,
    title: "Resume",
    description:
      "Create a professional resume and stand out in your career.",
    icon: FileText,
    iconColor: "#49b96a",
    iconBg: "#eaf8ed",
    border: "#bde8c8",
    features: [
      "Professional templates",
      "Personal information",
      "Education & Experience",
      "Skills & Achievements",
      "Projects",
      "Download & Share",
    ],
  },
  {
    id: "biography" as ProjectType,
    title: "Biography",
    description:
      "Create your personal or professional biography and share your story.",
    icon: UserRound,
    iconColor: "#f2a51b",
    iconBg: "#fff5df",
    border: "#f4dba6",
    features: [
      "About you",
      "Career & Experience",
      "Achievements",
      "Gallery (Images & Videos)",
      "Social Profiles",
      "Beautiful themes & templates",
    ],
  },
];

export default function CreateProjectPage() {
  const router = useRouter();
  const [selectedType, setSelectedType] =
    useState<ProjectType>("visiting-card");

  const handleContinue = () => {
    if (selectedType === "visiting-card") {
      router.push("/dashboard/projects/create-project/digicards");
    } else if (selectedType === "resume") {
      router.push("/dashboard/projects/create-project/resume");
    } else {
      router.push("/dashboard/projects/create-project/biography");
    }
  };

  return (
    <main className="min-h-screen bg-[#fafafd] text-[#20253a]">
      <section className="px-4 pb-8 pt-8 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[930px]">
          <div className="mb-7 text-center">
            <h1 className="text-[25px] font-bold tracking-[-0.6px] text-[#171c31] sm:text-[27px]">
              Create New Project
            </h1>
            <p className="mt-1.5 text-[13px] text-[#747b8c]">
              Select the type of project you want to create.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {projectTypes.map((project) => {
              const Icon = project.icon;
              const selected = selectedType === project.id;

              return (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => setSelectedType(project.id)}
                  className="relative text-left"
                >
                  <div
                    className={`relative flex h-full min-h-[418px] flex-col rounded-lg bg-white px-5 pb-5 pt-7 transition ${
                      selected
                        ? "border-[1.5px] shadow-[0_3px_14px_rgba(114,84,232,0.08)]"
                        : "border border-[#e5e7ec] shadow-[0_1px_5px_rgba(20,20,40,0.025)] hover:border-[#cfc8f7]"
                    }`}
                    style={{
                      borderColor: selected ? project.border : undefined,
                    }}
                  >
                    <div className="absolute right-4 top-4">
                      {selected ? (
                        <div className="flex h-[17px] w-[17px] items-center justify-center rounded-full bg-[#6944df]">
                          <Check size={11} strokeWidth={3} className="text-white" />
                        </div>
                      ) : (
                        <Circle size={17} strokeWidth={1.6} className="text-[#b8bec9]" />
                      )}
                    </div>

                    <div className="mb-4 flex h-[115px] items-center justify-center">
                      <div
                        className="relative flex h-[88px] w-[88px] items-center justify-center rounded-full"
                        style={{ backgroundColor: project.iconBg }}
                      >
                        <Icon size={53} strokeWidth={1.5} style={{ color: project.iconColor }} />
                      </div>
                    </div>

                    <h2
                      className={`text-center text-[17px] font-bold ${
                        selected ? "text-[#6844dd]" : "text-[#20253a]"
                      }`}
                    >
                      {project.title}
                    </h2>

                    <p className="mx-auto mt-2 min-h-[42px] max-w-[240px] text-center text-[11.5px] leading-[1.55] text-[#687083]">
                      {project.description}
                    </p>

                    <div className="my-3.5 h-px bg-[#ececf0]" />

                    <div className="space-y-2">
                      {project.features.map((feature) => (
                        <div
                          key={feature}
                          className="flex items-center gap-2 text-[10.5px] text-[#444b5c]"
                        >
                          <span
                            className="flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-full"
                            style={{ backgroundColor: project.iconBg }}
                          >
                            <Check
                              size={10}
                              strokeWidth={2.7}
                              style={{ color: project.iconColor }}
                            />
                          </span>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-7 flex flex-col items-center">
            <div className="flex w-full max-w-[325px] gap-3">
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="flex h-[38px] flex-1 items-center justify-center gap-2 rounded-md border border-[#dfe1e7] bg-white text-[12px] font-semibold text-[#363c4c] hover:bg-[#f7f7fa]"
              >
                <ArrowLeft size={14} strokeWidth={1.8} />
                Back
              </button>

              <button
                type="button"
                onClick={handleContinue}
                className="flex h-[38px] flex-1 items-center justify-center gap-2 rounded-md bg-gradient-to-r from-[#6338e5] to-[#7138e9] text-[12px] font-semibold text-white shadow-[0_4px_10px_rgba(105,65,220,0.18)] hover:from-[#5630cf] hover:to-[#6630d7]"
              >
                Continue
                <ArrowRight size={14} strokeWidth={1.8} />
              </button>
            </div>

            <p className="mt-4 text-[11px] text-[#8a909e]">
              You can change the project type later if you want.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
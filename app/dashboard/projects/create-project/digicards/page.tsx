"use client";

import { useEffect, useState } from "react";

import {
  ChevronRight,
  Eye,
  FilePenLine,
  Monitor,
  Moon,
  Palette,
  RotateCcw,
  Save,
  Smartphone,
  Sparkles,
  Type,
  MessageCircle,
  Folder,
  Check,
  Share2,
  Maximize,
  Rocket,
} from "lucide-react";

import {
  DigitalCardProvider,
  useDigitalCard,
} from "./components/DigitalCardEditor";

import StepNavigation from "./components/StepNavigation";
import LivePreview from "./components/LivePreview";

import BasicDetails from "./components/steps/BasicDetails";
import Contact from "./components/steps/contact";
import SocialLinks from "./components/steps/SocialLink";
import Services from "./components/steps/BussinessDetail";
import Gallery from "./components/steps/Gallery";
import ActionSetting from "./components/steps/ActionSetting";
import Publish from "./components/steps/Publish";

/* =========================================================
   TEMPLATE DATA
========================================================= */

export function getTemplateData(template: string) {
  switch (template) {
    case "template-2":
      return {
        background:
          "linear-gradient(145deg,#1769e0 0%,#287ce8 55%,#0e56c7 100%)",
        accent: "#ffffff",
      };

    case "template-3":
      return {
        background:
          "linear-gradient(145deg,#111111 0%,#191919 55%,#000000 100%)",
        accent: "#f0b400",
      };

    case "template-4":
      return {
        background:
          "linear-gradient(145deg,#15945f 0%,#24a86f 55%,#087348 100%)",
        accent: "#ffffff",
      };

    case "template-5":
      return {
        background:
          "linear-gradient(145deg,#6737e8 0%,#7438d7 55%,#4c20ba 100%)",
        accent: "#ffffff",
      };

    case "template-1":
    default:
      return {
        background:
          "linear-gradient(145deg,#17133a 0%,#21194e 55%,#100d29 100%)",
        accent: "#6737e8",
      };
  }
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function DigitalCardPage() {
  return (
    <DigitalCardProvider>
      <DigitalCardEditor />
    </DigitalCardProvider>
  );
}

/* =========================================================
   DIGITAL CARD EDITOR
========================================================= */

function DigitalCardEditor() {
  const [currentStep, setCurrentStep] =
    useState(1);

  const [selectedTemplate, setSelectedTemplate] =
    useState("template-1");

  const { card, updateCard } = useDigitalCard();

  /* =======================================================
     SYNC TEMPLATE FROM PROVIDER
  ======================================================= */

  useEffect(() => {
    const providerTemplate =
      card?.templateId || "template-1";

    setSelectedTemplate(providerTemplate);
  }, [card?.templateId]);

  /* =======================================================
     TEMPLATE SELECT
  ======================================================= */

  const handleTemplateChange = (
    template: string
  ) => {
    setSelectedTemplate(template);

    /*
     * This is important.
     *
     * templateId is the value used by both
     * the editor and LivePreview.
     */
    updateCard("templateId", template);
  };

  /* =======================================================
     RENDER STEP
  ======================================================= */

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BasicDetails />;

      case 2:
        return <Contact />;

      case 3:
        return <SocialLinks />;

      case 4:
        return <Services />;

      case 5:
        return <Gallery />;

      case 6:
        return <ActionSetting />;

      case 7:
        return <Publish />;

      default:
        return <BasicDetails />;
    }
  };

  /* =======================================================
     NEXT
  ======================================================= */

  const goNext = () => {
    setCurrentStep((previous) =>
      Math.min(previous + 1, 7)
    );
  };

  /* =======================================================
     PREVIOUS
  ======================================================= */

  const goPrevious = () => {
    setCurrentStep((previous) =>
      Math.max(previous - 1, 1)
    );
  };

  /* =======================================================
     PUBLISH
  ======================================================= */

  const handlePublish = () => {
    console.log("Publishing card...");
    console.log("Selected Template:", selectedTemplate);
    console.log("Card:", card);

    /*
     * API call can be added here.
     *
     * Example:
     *
     * await publishCard(card);
     */
  };

  return (
    <div className="min-h-screen min-w-[1100px] bg-[#f8f9fc] text-[#171717]">

      {/* =====================================================
          TOP HEADER
      ===================================================== */}

      <header className="sticky top-0 z-50 h-[66px] border-b border-[#e7e7ed] bg-white">
        <div className="flex h-full items-center justify-between px-6">

          {/* LEFT */}
          <div className="flex h-full items-center">

            {/* BACK */}
            <button
              type="button"
              className="flex items-center gap-2 text-[11px] font-medium text-[#444] transition hover:text-[#6737e8]"
            >
              <span className="text-[17px] leading-none">
                ←
              </span>

              Back to My Projects
            </button>

            <div className="mx-5 h-7 w-px bg-[#e7e7ec]" />

            {/* PROJECT */}
            <div>
              <p className="mb-1 text-[8px] text-[#999]">
                Project Name:
              </p>

              <div className="flex items-center gap-2">
                <span className="text-[12px] font-semibold text-[#242424]">
                  Sriram Singh Card
                </span>

                <FilePenLine
                  size={13}
                  strokeWidth={1.8}
                  className="text-[#6737e8]"
                />
              </div>
            </div>

            <div className="mx-5 h-7 w-px bg-[#e7e7ec]" />

            {/* DRAFT */}
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#eaf9ef] px-3 py-1.5 text-[9px] font-medium text-[#25a653]">
                Draft Saved
              </span>

              <span className="text-[9px] text-[#999]">
                Last saved just now
              </span>

              <Check
                size={13}
                className="text-[#25a653]"
              />
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-2.5">

            {/* PREVIEW */}
            <button
              type="button"
              className="flex h-[36px] items-center gap-2 rounded-lg border border-[#dfdfe6] bg-white px-4 text-[10px] font-medium text-[#333] transition hover:border-[#6737e8] hover:text-[#6737e8]"
            >
              <Eye
                size={14}
                strokeWidth={1.8}
              />

              Preview
            </button>

            {/* SAVE DRAFT */}
            <button
              type="button"
              className="flex h-[36px] items-center gap-2 rounded-lg border border-[#6737e8] bg-white px-4 text-[10px] font-semibold text-[#6737e8] transition hover:bg-[#f7f4ff]"
            >
              <Save
                size={14}
                strokeWidth={1.8}
              />

              Save Draft
            </button>

            {/* PUBLISH / CONTINUE */}
            {currentStep === 7 ? (
              <button
                type="button"
                onClick={handlePublish}
                className="flex h-[36px] items-center gap-2 rounded-lg bg-[#6737e8] px-5 text-[10px] font-semibold text-white shadow-[0_4px_12px_rgba(103,55,232,0.18)] transition hover:bg-[#5830d1]"
              >
                <Rocket
                  size={14}
                  strokeWidth={2}
                />

                Publish & Live
              </button>
            ) : (
              <button
                type="button"
                onClick={goNext}
                className="flex h-[36px] items-center gap-2 rounded-lg bg-[#6737e8] px-5 text-[10px] font-semibold text-white shadow-[0_4px_12px_rgba(103,55,232,0.18)] transition hover:bg-[#5830d1]"
              >
                Continue

                <span className="text-[14px]">
                  →
                </span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* =====================================================
          MAIN 3 COLUMN EDITOR
      ===================================================== */}

      <main className="grid min-h-[calc(100vh)] grid-cols-[500px_310px_minmax(390px,1fr)] bg-white">

        {/* ===================================================
            LEFT COLUMN
        =================================================== */}

        <section className="relative min-w-0 border-r border-[#e6e6eb] bg-white">

          {/* EDITOR HEADER */}
          <div className="border-b border-[#eeeeee] px-5 py-5 sm:px-6">

            <div className="flex items-center gap-3">

              <div className="flex h-[38px] w-[38px] items-center justify-center rounded-[7px] bg-[#f3efff]">
                <Folder
                  size={19}
                  strokeWidth={1.8}
                  className="text-[#6335e9]"
                />
              </div>

              <div>
                <h1 className="text-[14px] font-semibold leading-[18px] text-[#222]">
                  Digital Visiting Card
                </h1>

                <p className="mt-[2px] text-[10px] leading-[14px] text-[#858585]">
                  Step {currentStep} of 7 -{" "}
                  {getStepName(currentStep)}
                </p>
              </div>
            </div>

            {/* STEPPER */}
            <div className="mt-6 px-[2px]">
              <StepNavigation
                currentStep={currentStep}
                setCurrentStep={setCurrentStep}
              />
            </div>
          </div>

          {/* FORM AREA */}
          <div className="relative min-h-[calc(100vh-220px)]">

            <div className="px-5 pb-[150px] pt-7 sm:px-6 sm:pt-8">
              {renderStep()}
            </div>

            {/* AUTO SAVE */}
            <div className="absolute bottom-[58px] left-0 right-0 border-t border-[#eeeeee] bg-white px-5 py-4 sm:px-6">

              <div className="flex items-center gap-[8px]">

                <div className="flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-full bg-[#dcf8e5]">
                  <Check
                    size={11}
                    strokeWidth={2.5}
                    className="text-[#21a452]"
                  />
                </div>

                <div>
                  <p className="text-[9px] font-semibold leading-[12px] text-[#3b3b3b]">
                    Auto saved as Draft
                  </p>

                  <p className="mt-[1px] text-[8px] leading-[11px] text-[#999]">
                    Your changes are saved automatically
                  </p>
                </div>

              </div>
            </div>

            {/* FORM ACTIONS */}
            <div className="absolute bottom-0 left-0 right-0 border-t border-[#eeeeee] bg-white px-5 py-3 sm:px-6">

              <div className="flex items-center justify-between">

                {/* PREVIOUS */}
                <button
                  type="button"
                  disabled={currentStep === 1}
                  onClick={goPrevious}
                  className="
                    flex
                    h-[28px]
                    items-center
                    gap-1.5
                    rounded-[5px]
                    border
                    border-[#dedee5]
                    bg-white
                    px-3
                    text-[9px]
                    font-medium
                    text-[#555]
                    transition
                    hover:border-[#6737e8]
                    hover:text-[#6737e8]
                    disabled:cursor-not-allowed
                    disabled:opacity-0
                  "
                >
                  <span className="text-[11px]">
                    ←
                  </span>

                  Previous
                </button>

                {/* LAST STEP */}
                {currentStep === 7 ? (
                  <button
                    type="button"
                    onClick={handlePublish}
                    className="
                      flex
                      h-[28px]
                      items-center
                      gap-1
                      rounded-[5px]
                      bg-[#5d2ee8]
                      px-[17px]
                      text-[9px]
                      font-semibold
                      text-white
                      shadow-[0_2px_6px_rgba(93,46,232,0.18)]
                      transition
                      hover:bg-[#4f26cf]
                      active:scale-[0.98]
                    "
                  >
                    <Rocket size={10} />

                    Publish & Live
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={goNext}
                    className="
                      flex
                      h-[28px]
                      items-center
                      gap-1
                      rounded-[5px]
                      bg-[#5d2ee8]
                      px-[17px]
                      text-[9px]
                      font-semibold
                      text-white
                      shadow-[0_2px_6px_rgba(93,46,232,0.18)]
                      transition
                      hover:bg-[#4f26cf]
                      active:scale-[0.98]
                    "
                  >
                    Save & Next

                    <span className="text-[11px]">
                      →
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================
            CENTER COLUMN
        =================================================== */}

        <section className="min-w-0 border-r border-[#e6e6eb] bg-white">

          <div className="px-4 py-5">

            {/* TEMPLATE HEADER */}
            <div className="mb-4 flex items-center justify-between">

              <h2 className="text-[11px] font-semibold text-[#292929]">
                Choose Template
              </h2>

              <button
                type="button"
                className="text-[9px] font-medium text-[#6737e8] transition hover:underline"
              >
                View All
              </button>
            </div>

            {/* TEMPLATES */}
            <div className="space-y-3">

              {[
                "template-1",
                "template-2",
                "template-3",
                "template-4",
                "template-5",
              ].map((template) => (
                <Template
                  key={template}
                  template={template}
                  selectedTemplate={
                    selectedTemplate
                  }
                  onSelect={
                    handleTemplateChange
                  }
                />
              ))}
            </div>

            {/* CUSTOMIZE */}
            <CustomizeDesign />
          </div>
        </section>

        {/* ===================================================
            RIGHT COLUMN
        =================================================== */}

        <section className="relative min-w-0 overflow-hidden bg-[#fafafd]">

          {/* PREVIEW HEADER */}
          <div className="flex h-[58px] items-center justify-between border-b border-[#eeeeF2] bg-white px-6">

            <h2 className="text-[12px] font-semibold text-[#272727]">
              Live Preview
            </h2>

            {/* DEVICE SWITCH */}
            <div className="flex h-[32px] items-center rounded-lg border border-[#dfdfe7] bg-[#f7f7fa] p-1">

              <button
                type="button"
                className="flex h-[24px] w-[38px] items-center justify-center rounded-md bg-[#f0edff] text-[#6737e8] shadow-sm"
              >
                <Monitor
                  size={13}
                  strokeWidth={2}
                />
              </button>

              <button
                type="button"
                className="flex h-[24px] w-[38px] items-center justify-center rounded-md text-[#888] transition hover:text-[#6737e8]"
              >
                <Smartphone
                  size={13}
                  strokeWidth={2}
                />
              </button>
            </div>
          </div>

          {/* LIVE PREVIEW */}
          <div
            className="
              flex
              min-h-[calc(100vh-145px)]
              items-start
              justify-center
              overflow-auto
              px-6
              py-6
              sm:px-8
              sm:py-7
            "
          >
            <div className="flex w-[282px] min-w-[282px] max-w-[282px] flex-col items-center">

              <div
                className="
                  h-[623px]
                  w-[282px]
                  min-h-[623px]
                  min-w-[282px]
                  max-h-[623px]
                  max-w-[282px]
                "
              >

                {/* =================================================
                    IMPORTANT FIX

                    Pass selectedTemplate to LivePreview.
                ================================================= */}

                <LivePreview
                  key={selectedTemplate}
                  currentStep={currentStep}
                  template={selectedTemplate}
                />

              </div>
            </div>
          </div>

          {/* =================================================
              PREVIEW BOTTOM ACTIONS
          ================================================= */}

          <div
            className="
              absolute
              bottom-4
              left-0
              right-0
              flex
              items-center
              justify-center
              gap-3
              px-4
            "
          >

            {currentStep === 7 ? (
              <>
                {/* READY */}
                <div
                  className="
                    flex
                    h-[39px]
                    items-center
                    gap-2
                    rounded-md
                    border
                    border-[#d9efdf]
                    bg-[#f1fbf5]
                    px-4
                  "
                >
                  <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#dff7e9]">
                    <Check
                      size={11}
                      strokeWidth={3}
                      className="text-[#21a452]"
                    />
                  </span>

                  <span className="text-[9px] font-semibold text-[#299b55]">
                    Ready to go live
                  </span>
                </div>

                {/* PUBLISH */}
                <button
                  type="button"
                  onClick={handlePublish}
                  className="
                    flex
                    h-[39px]
                    min-w-[145px]
                    items-center
                    justify-center
                    gap-2
                    rounded-md
                    bg-[#6737e8]
                    px-4
                    text-[10px]
                    font-semibold
                    text-white
                    shadow-[0_4px_12px_rgba(103,55,232,0.20)]
                    transition
                    hover:bg-[#5830d1]
                    active:scale-[0.98]
                  "
                >
                  <Rocket
                    size={14}
                    strokeWidth={2}
                  />

                  Publish & Live
                </button>
              </>
            ) : (
              <>
                {/* SHARE */}
                <button
                  type="button"
                  className="
                    flex
                    h-[39px]
                    min-w-[145px]
                    items-center
                    justify-center
                    gap-2
                    rounded-md
                    border
                    border-[#dedee6]
                    bg-white
                    px-4
                    text-[10px]
                    font-medium
                    text-[#555]
                    shadow-[0_1px_3px_rgba(0,0,0,0.04)]
                    transition
                    hover:border-[#6737e8]
                    hover:text-[#6737e8]
                  "
                >
                  <Share2
                    size={14}
                    strokeWidth={1.8}
                  />

                  Share Preview
                </button>

                {/* FULL SCREEN */}
                <button
                  type="button"
                  className="
                    flex
                    h-[39px]
                    min-w-[145px]
                    items-center
                    justify-center
                    gap-2
                    rounded-md
                    border
                    border-[#dedee6]
                    bg-white
                    px-4
                    text-[10px]
                    font-medium
                    text-[#6737e8]
                    shadow-[0_1px_3px_rgba(0,0,0,0.04)]
                    transition
                    hover:border-[#6737e8]
                    hover:bg-[#faf8ff]
                  "
                >
                  <Maximize
                    size={14}
                    strokeWidth={1.8}
                  />

                  View Full Screen
                </button>
              </>
            )}
          </div>
        </section>
      </main>

      {/* =====================================================
          FLOATING HELP
      ===================================================== */}

      <button
        type="button"
        className="fixed bottom-5 right-5 z-[100] flex h-11 w-11 items-center justify-center rounded-full bg-[#6737e8] text-white shadow-[0_6px_20px_rgba(103,55,232,0.3)] transition hover:scale-105 hover:bg-[#5830d1]"
      >
        <MessageCircle size={19} />
      </button>
    </div>
  );
}

/* =========================================================
   TEMPLATE COMPONENT
========================================================= */

function Template({
  template,
  selectedTemplate,
  onSelect,
}: {
  template: string;
  selectedTemplate: string;
  onSelect: (template: string) => void;
}) {
  const { card } = useDigitalCard();

  const selected =
    selectedTemplate === template;

  const templateData =
    getTemplateData(template);

  return (
    <button
      type="button"
      onClick={() => onSelect(template)}
      aria-pressed={selected}
      className={[
        "group relative block w-full overflow-hidden rounded-[9px] text-left transition-all duration-200",
        selected
          ? "ring-2 ring-[#6737e8] ring-offset-1"
          : "border border-transparent hover:ring-1 hover:ring-[#d8d0fa]",
      ].join(" ")}
    >
      {/* MINI TEMPLATE */}
      <div
        className="relative h-[77px] w-full overflow-hidden rounded-[9px]"
        style={{
          background:
            templateData.background,
        }}
      >
        {/* DECORATIVE CIRCLE */}
        <div
          className="absolute -right-8 -top-9 h-28 w-28 rounded-full opacity-20"
          style={{
            background:
              templateData.accent,
          }}
        />

        {/* DECORATIVE SHAPE */}
        <div
          className="absolute -bottom-12 left-12 h-24 w-40 rotate-[-15deg] rounded-full opacity-10"
          style={{
            background: "#ffffff",
          }}
        />

        {/* PROFILE */}
        <div className="absolute left-3 top-3 flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border-2 border-white/70 bg-[#f3c995]">
          {card.profilePhoto ? (
            <img
              src={card.profilePhoto}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-[15px]">
              👤
            </span>
          )}
        </div>

        {/* TEXT */}
        <div className="absolute left-[60px] top-3">

          <p className="max-w-[105px] truncate text-[9px] font-bold text-white">
            {card.fullName ||
              "Sriram Singh"}
          </p>

          <p className="mt-0.5 text-[6px] text-white/90">
            {card.designation ||
              "Founder & CEO"}
          </p>

          <p className="mt-0.5 max-w-[100px] truncate text-[5px] text-white/70">
            {card.companyName ||
              "SoftFYR Technologies"}
          </p>

        </div>

        {/* MINI ACTION ICONS */}
        <div className="absolute bottom-3 left-[60px] flex gap-1.5">
          {["☎", "◉", "✉", "◎"].map(
            (icon, index) => (
              <span
                key={index}
                className="flex h-4 w-4 items-center justify-center rounded-full border border-white/50 text-[6px] text-white"
              >
                {icon}
              </span>
            )
          )}
        </div>

        {/* SELECTED */}
        {selected && (
          <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#6737e8] text-white shadow-md">
            <Check size={11} />
          </div>
        )}
      </div>
    </button>
  );
}

/* =========================================================
   CUSTOMIZE DESIGN
========================================================= */

function CustomizeDesign() {
  return (
    <div className="mt-4 overflow-hidden rounded-[9px] border border-[#e1e1e7] bg-white">

      <div className="border-b border-[#eeeeF2] px-3 py-2.5">
        <h3 className="text-[10px] font-semibold text-[#333]">
          Customize Design
        </h3>
      </div>

      {/* FONT */}
      <button
        type="button"
        className="flex w-full items-center justify-between border-b border-[#eeeeF2] px-3 py-2.5 text-left transition hover:bg-[#fafafa]"
      >
        <div className="flex items-center gap-2">
          <Type
            size={12}
            className="text-[#555]"
          />

          <span className="text-[9px] text-[#444]">
            Fonts
          </span>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-[9px] text-[#777]">
            Poppins
          </span>

          <ChevronRight
            size={12}
            className="text-[#aaa]"
          />
        </div>
      </button>

      {/* PRIMARY COLOR */}
      <button
        type="button"
        className="flex w-full items-center justify-between border-b border-[#eeeeF2] px-3 py-2.5 text-left transition hover:bg-[#fafafa]"
      >
        <div className="flex items-center gap-2">
          <Palette
            size={12}
            className="text-[#555]"
          />

          <span className="text-[9px] text-[#444]">
            Primary Color
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="h-4 w-4 rounded-full bg-[#6737e8] ring-2 ring-purple-100" />

          <ChevronRight
            size={12}
            className="text-[#aaa]"
          />
        </div>
      </button>

      {/* BACKGROUND */}
      <button
        type="button"
        className="flex w-full items-center justify-between border-b border-[#eeeeF2] px-3 py-2.5 text-left transition hover:bg-[#fafafa]"
      >
        <div className="flex items-center gap-2">
          <Moon
            size={12}
            className="text-[#555]"
          />

          <span className="text-[9px] text-[#444]">
            Background
          </span>
        </div>

        <div className="flex items-center gap-1">
          <span className="h-4 w-4 rounded-full bg-[#19143c]" />

          <ChevronRight
            size={12}
            className="text-[#aaa]"
          />
        </div>
      </button>

      {/* BUTTON STYLE */}
      <button
        type="button"
        className="flex w-full items-center justify-between border-b border-[#eeeeF2] px-3 py-2.5 text-left transition hover:bg-[#fafafa]"
      >
        <div className="flex items-center gap-2">
          <Sparkles
            size={12}
            className="text-[#555]"
          />

          <span className="text-[9px] text-[#444]">
            Button Style
          </span>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-[9px] text-[#777]">
            Rounded
          </span>

          <ChevronRight
            size={12}
            className="text-[#aaa]"
          />
        </div>
      </button>

      {/* RESET */}
      <div className="px-3 pb-3 pt-2">
        <button
          type="button"
          className="flex h-[30px] w-full items-center justify-center gap-1 rounded-md border border-[#e3e3e7] text-[8px] font-medium text-[#777] transition hover:bg-[#fafafa]"
        >
          <RotateCcw size={10} />

          Reset to Default
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   STEP NAME
========================================================= */

function getStepName(step: number) {
  switch (step) {
    case 1:
      return "Basic Details";

    case 2:
      return "Contact";

    case 3:
      return "Social Links";

    case 4:
      return "Services";

    case 5:
      return "Gallery";

    case 6:
      return "Actions & Settings";

    case 7:
      return "Publish";

    default:
      return "Basic Details";
  }
}
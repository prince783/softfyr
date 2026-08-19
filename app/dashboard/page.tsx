"use client";

import { useRouter } from "next/navigation";
import {
  Activity,
  ArrowRight,
  BarChart3,
  CreditCard,
  FileText,
  MoreVertical,
  Plus,
  QrCode,
  ScanQrCode,
  Share2,
  Sparkles,
  TrendingUp,
  UserRound,
  UsersRound,
} from "lucide-react";

const stats = [
  {
    label: "Total Projects",
    value: "04",
    icon: FileText,
    iconBg: "bg-[#f0ebff]",
    iconColor: "text-[#7254e8]",
  },
  {
    label: "Active Cards",
    value: "03",
    icon: CreditCard,
    iconBg: "bg-[#eaf9ed]",
    iconColor: "text-[#43b95f]",
  },
  {
    label: "Total Views",
    value: "1,245",
    icon: Activity,
    iconBg: "bg-[#fff0ef]",
    iconColor: "text-[#f26b67]",
  },
  {
    label: "QR Scans",
    value: "186",
    icon: QrCode,
    iconBg: "bg-[#e9fbf8]",
    iconColor: "text-[#37b9aa]",
  },
  {
    label: "Shares",
    value: "92",
    icon: Share2,
    iconBg: "bg-[#edf5ff]",
    iconColor: "text-[#4c9bea]",
  },
];

const projects = [
  {
    name: "My Business Card",
    url: "softfyr.com/card/sriram-singh",
    status: "Active",
    statusClass: "bg-[#e8f8ed] text-[#35a957]",
    icon: UsersRound,
  },
  {
    name: "Marketing Card",
    url: "softfyr.com/card/marketing",
    status: "Active",
    statusClass: "bg-[#e8f8ed] text-[#35a957]",
    icon: Share2,
  },
  {
    name: "Personal Card",
    url: "softfyr.com/card/personal",
    status: "Draft",
    statusClass: "bg-[#f0f1f3] text-[#6f7480]",
    icon: QrCode,
  },
];

const quickActions = [
  {
    title: "Create New Card",
    description: "Create a new digital card",
    icon: Plus,
    iconBg: "bg-[#f0ebff]",
    iconColor: "text-[#7254e8]",
    href: "/create-project",
  },
  {
    title: "View My Cards",
    description: "Manage your cards",
    icon: CreditCard,
    iconBg: "bg-[#edf5ff]",
    iconColor: "text-[#4c9bea]",
    href: "/dashboard/projects",
  },
  {
    title: "Upgrade Plan",
    description: "Unlock more features",
    icon: Sparkles,
    iconBg: "bg-[#fff5df]",
    iconColor: "text-[#e9a52f]",
    href: "/dashboard/subscription",
  },
  {
    title: "Share My Card",
    description: "Share your card",
    icon: Share2,
    iconBg: "bg-[#edf5ff]",
    iconColor: "text-[#4c9bea]",
    href: "/dashboard/projects",
  },
];

export default function DashboardPage() {
  const router = useRouter();

  return (
    <main className="min-h-[calc(100vh-64px)] bg-[#f8f9fc] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1400px]">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-[25px] font-bold tracking-[-0.5px] text-[#20253a]">
            Dashboard
          </h1>
          <p className="mt-1 text-[14px] text-[#747b8c]">
            Welcome back, Sriram! 👋
          </p>
        </div>

        {/* Stats */}
        <section className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="flex min-h-[103px] items-center gap-4 rounded-xl border border-[#edf0f4] bg-white px-5 shadow-[0_1px_4px_rgba(20,20,40,0.025)]"
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${stat.iconBg}`}
                >
                  <Icon
                    size={21}
                    strokeWidth={1.8}
                    className={stat.iconColor}
                  />
                </div>

                <div>
                  <p className="text-[13px] font-medium text-[#687083]">
                    {stat.label}
                  </p>
                  <p className="mt-1 text-[25px] font-bold leading-none tracking-[-0.5px] text-[#20253a]">
                    {stat.value}
                  </p>
                </div>
              </div>
            );
          })}
        </section>

        {/* Recent Projects + Analytics */}
        <section className="mb-5 grid grid-cols-1 gap-5 xl:grid-cols-[0.95fr_1.05fr]">
          {/* Recent Projects */}
          <div className="rounded-xl border border-[#edf0f4] bg-white shadow-[0_1px_4px_rgba(20,20,40,0.025)]">
            <div className="flex items-center justify-between border-b border-[#f0f1f4] px-5 py-4">
              <h2 className="text-[16px] font-semibold text-[#252a3d]">
                Recent Projects
              </h2>
            </div>

            <div className="px-5">
              {projects.map((project, index) => {
                const Icon = project.icon;

                return (
                  <div
                    key={project.name}
                    className={`flex min-h-[75px] items-center gap-3 ${
                      index !== projects.length - 1
                        ? "border-b border-[#f0f1f4]"
                        : ""
                    }`}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#f2eeff]">
                      <Icon
                        size={19}
                        strokeWidth={1.8}
                        className="text-[#7355e8]"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-semibold text-[#30354a]">
                        {project.name}
                      </p>
                      <p className="mt-1 truncate text-[11px] text-[#8a909d]">
                        {project.url}
                      </p>
                    </div>

                    <span
                      className={`hidden rounded-full px-3 py-1 text-[10px] font-semibold sm:block ${project.statusClass}`}
                    >
                      {project.status}
                    </span>

                    <button
                      type="button"
                      aria-label={`More options for ${project.name}`}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[#737987] transition hover:bg-[#f6f4ff] hover:text-[#6d4de3]"
                    >
                      <MoreVertical size={18} strokeWidth={1.8} />
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="px-5 pb-4 pt-3">
              <button
                type="button"
                onClick={() => router.push("/dashboard/projects")}
                className="flex h-10 w-full items-center justify-center rounded-lg border border-[#eeeaf9] text-[12px] font-semibold text-[#6749d9] transition hover:bg-[#f8f5ff]"
              >
                View All Projects
              </button>
            </div>
          </div>

          {/* Analytics */}
          <div className="rounded-xl border border-[#edf0f4] bg-white shadow-[0_1px_4px_rgba(20,20,40,0.025)]">
            <div className="flex items-center justify-between border-b border-[#f0f1f4] px-5 py-4">
              <h2 className="text-[16px] font-semibold text-[#252a3d]">
                Analytics Overview
              </h2>

              <button
                type="button"
                className="flex items-center gap-2 rounded-lg border border-[#e8eaf0] bg-white px-3 py-2 text-[11px] font-medium text-[#606777] hover:bg-[#fafaff]"
              >
                This Month
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                >
                  <path
                    d="M3 4.5L6 7.5L9 4.5"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            <div className="px-4 pb-3 pt-4 sm:px-5">
              <div className="relative h-[245px]">
                {/* Grid */}
                <div className="absolute inset-x-0 top-3 bottom-8 flex flex-col justify-between">
                  {[800, 600, 400, 200, 0].map((value) => (
                    <div
                      key={value}
                      className="flex items-center gap-3"
                    >
                      <span className="w-7 text-right text-[10px] text-[#a0a5b0]">
                        {value}
                      </span>
                      <div className="h-px flex-1 bg-[#f0f1f4]" />
                    </div>
                  ))}
                </div>

                {/* Chart */}
                <svg
                  className="absolute left-[40px] right-0 top-3 h-[205px] w-[calc(100%-40px)] overflow-visible"
                  viewBox="0 0 600 205"
                  preserveAspectRatio="none"
                  fill="none"
                >
                  <path
                    d="M0 184
                       C35 155 45 100 82 94
                       C116 88 120 133 158 137
                       C195 141 207 78 239 61
                       C271 44 284 106 319 105
                       C354 104 365 51 397 32
                       C430 13 447 87 481 87
                       C516 87 531 60 548 72
                       C565 84 578 32 600 18"
                    stroke="#7557df"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>

                {/* X Axis */}
                <div className="absolute bottom-0 left-[40px] right-0 flex justify-between">
                  {["01 May", "08 May", "15 May", "22 May", "29 May"].map(
                    (date) => (
                      <span
                        key={date}
                        className="text-[10px] text-[#9a9faa]"
                      >
                        {date}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="rounded-xl border border-[#edf0f4] bg-white shadow-[0_1px_4px_rgba(20,20,40,0.025)]">
          <div className="border-b border-[#f0f1f4] px-5 py-4">
            <h2 className="text-[16px] font-semibold text-[#252a3d]">
              Quick Actions
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <button
                  key={action.title}
                  type="button"
                  onClick={() => router.push(action.href)}
                  className="group flex min-h-[78px] items-center gap-3 rounded-xl border border-[#edf0f4] bg-white px-4 text-left transition hover:-translate-y-0.5 hover:border-[#ddd5fb] hover:shadow-sm"
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${action.iconBg}`}
                  >
                    <Icon
                      size={19}
                      strokeWidth={1.8}
                      className={action.iconColor}
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-[#30354a]">
                      {action.title}
                    </p>
                    <p className="mt-1 text-[11px] text-[#8a909d]">
                      {action.description}
                    </p>
                  </div>

                  <ArrowRight
                    size={15}
                    strokeWidth={1.8}
                    className="ml-auto hidden text-[#aaaeba] transition group-hover:translate-x-1 group-hover:text-[#7355e8] sm:block"
                  />
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
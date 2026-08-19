"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowUpDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  Edit3,
  FileText,
  Image as ImageIcon,
  Link2,
  MoreVertical,
  Plus,
  Search,
  UserRound,
} from "lucide-react";

type ProjectType = "Digital Visiting Card" | "RESUME" | "Biography";
type Status = "Active" | "Draft" | "Expired";

interface Project {
  id: number;
  name: string;
  url: string;
  type: ProjectType;
  status: Status;
  views: string;
  scans: string;
  shares: string;
  created: string;
  createdTime: string;
  expires: string;
  expiresTime?: string;
  image?: string;
}

const projects: Project[] = [
  {
    id: 1,
    name: "Prince Card",
    url: "softfyr.com/card/princeojha",
    type: "Digital Visiting Card",
    status: "Active",
    views: "12",
    scans: "2",
    shares: "5",
    created: "15 May 2026",
    createdTime: "10:30 AM",
    expires: "15 May 2026",
    expiresTime: "(364 days left)",
  },
  {
    id: 2,
    name: "My Resume",
    url: "softfyr.com/resume/prince",
    type: "RESUME",
    status: "Active",
    views: "8",
    scans: "5",
    shares: "3",
    created: "15 May 2026",
    createdTime: "02:15 PM",
    expires: "10 May 2026",
    expiresTime: "(359 days left)",
  },
   
];

const typeStyles: Record<ProjectType, string> = {
  "Digital Visiting Card": "bg-[#f1eaff] text-[#7351df]",
  RESUME: "bg-[#eaf3ff] text-[#3985df]",
  Biography: "bg-[#eaf9ed] text-[#43a85b]",
};

const typeIcons: Record<ProjectType, typeof FileText> = {
  "Digital Visiting Card": ImageIcon,
  RESUME: FileText,
  Biography: UserRound,
};

export default function MyProjectsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All Types");
  const [status, setStatus] = useState("All Status");
  const [page, setPage] = useState(1);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.name.toLowerCase().includes(search.toLowerCase()) ||
        project.url.toLowerCase().includes(search.toLowerCase());

      const matchesType =
        type === "All Types" || project.type === type;

      const matchesStatus =
        status === "All Status" || project.status === status;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [search, type, status]);

  return (
    <main className="min-h-[calc(100vh-64px)] bg-[#f8f9fc] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1400px]">
        {/* Header */}
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-[21px] font-bold tracking-[-0.4px] text-[#20253a]">
              My Projects
            </h1>
            <p className="mt-1 text-[11px] text-[#747b8c]">
              Create, manage and track all your projects in one place.
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/dashboard/projects/create-project")}
            className="flex h-[38px] items-center justify-center gap-2 self-start rounded-md bg-gradient-to-r from-[#6338e5] to-[#7138e9] px-4 text-[12px] font-semibold text-white shadow-[0_3px_8px_rgba(105,65,220,0.18)] transition hover:from-[#5630cf] hover:to-[#6630d7] sm:self-auto"
          >
            <Plus size={16} strokeWidth={2} />
            Create New
          </button>
        </div>

        {/* Summary Cards */}
        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            active
            title="All Projects"
            value="12"
            icon={FolderIcon}
          />
          <SummaryCard
            title="Digital Visiting Cards"
            value="07"
            icon={ImageIcon}
            iconBg="bg-[#f1eaff]"
            iconColor="text-[#7254e8]"
          />
          <SummaryCard
            title="RESUME"
            value="03"
            icon={FileText}
            iconBg="bg-[#eaf3ff]"
            iconColor="text-[#3985df]"
          />
          <SummaryCard
            title="Biography"
            value="02"
            icon={UserRound}
            iconBg="bg-[#eaf9ed]"
            iconColor="text-[#43a85b]"
          />
        </div>

        {/* Main Table Card */}
        <section className="overflow-hidden rounded-xl border border-[#e8eaf0] bg-white shadow-[0_1px_4px_rgba(20,20,40,0.025)]">
          {/* Filters */}
          <div className="flex flex-col gap-3 border-b border-[#eef0f4] p-3.5 lg:flex-row lg:items-center">
            <div className="relative w-full lg:w-[215px]">
              <Search
                size={15}
                strokeWidth={1.8}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9298a5]"
              />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search projects..."
                className="h-[35px] w-full rounded-md border border-[#e4e6ec] bg-white pl-9 pr-3 text-[11px] text-[#363c4c] outline-none placeholder:text-[#9da2ad] focus:border-[#9b87e8]"
              />
            </div>

            <SelectFilter
              value={type}
              options={[
                "All Types",
                "Digital Visiting Card",
                "RESUME",
                "Biography",
              ]}
              onChange={setType}
            />

            <SelectFilter
              value={status}
              options={["All Status", "Active", "Draft", "Expired"]}
              onChange={setStatus}
            />

            <button
              type="button"
              className="ml-auto flex h-[35px] items-center gap-2 rounded-md border border-[#e4e6ec] px-3 text-[11px] font-medium text-[#555c6c]"
            >
              Recently Updated
              <ArrowUpDown size={13} strokeWidth={1.7} />
            </button>
          </div>

          {/* Desktop Table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[1050px] border-collapse">
              <thead>
                <tr className="h-[37px] border-b border-[#eceef2] bg-[#fafbfc] text-left">
                  <th className="px-4 text-[9px] font-semibold text-[#52596a]">Project</th>
                  <th className="px-3 text-[9px] font-semibold text-[#52596a]">Type</th>
                  <th className="px-3 text-[9px] font-semibold text-[#52596a]">Status</th>
                  <th className="px-3 text-[9px] font-semibold text-[#52596a]">Views</th>
                  <th className="px-3 text-[9px] font-semibold text-[#52596a]">QR Scans</th>
                  <th className="px-3 text-[9px] font-semibold text-[#52596a]">Shares</th>
                  <th className="px-3 text-[9px] font-semibold text-[#52596a]">Created On</th>
                  <th className="px-3 text-[9px] font-semibold text-[#52596a]">Expires On</th>
                  <th className="px-3 text-[9px] font-semibold text-[#52596a]">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredProjects.map((project) => {
                  const TypeIcon = typeIcons[project.type];

                  return (
                    <tr
                      key={project.id}
                      className="border-b border-[#eef0f3] transition hover:bg-[#fcfbff]"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-[43px] w-[63px] shrink-0 items-center justify-center overflow-hidden rounded-md bg-[#eef1f7]">
                            <TypeIcon
                              size={21}
                              strokeWidth={1.5}
                              className="text-[#778092]"
                            />
                          </div>

                          <div className="min-w-0">
                            <p className="text-[10.5px] font-semibold text-[#34394b]">
                              {project.name}
                            </p>
                            <div className="mt-1 flex max-w-[190px] items-center gap-1">
                              <span className="truncate text-[9px] text-[#8a909d]">
                                {project.url}
                              </span>
                              <Copy
                                size={10}
                                className="shrink-0 text-[#9aa0ac]"
                              />
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-3">
                        <span
                          className={`rounded-md px-2 py-1 text-[8px] font-semibold ${typeStyles[project.type]}`}
                        >
                          {project.type}
                        </span>
                      </td>

                      <td className="px-3">
                        <StatusBadge status={project.status} />
                      </td>

                      <td className="px-3 text-[9.5px] font-medium text-[#3f4657]">
                        {project.views}
                      </td>
                      <td className="px-3 text-[9.5px] font-medium text-[#3f4657]">
                        {project.scans}
                      </td>
                      <td className="px-3 text-[9.5px] font-medium text-[#3f4657]">
                        {project.shares}
                      </td>

                      <td className="px-3">
                        <p className="text-[9px] font-medium text-[#4d5362]">
                          {project.created}
                        </p>
                        <p className="mt-1 text-[8px] text-[#9298a5]">
                          {project.createdTime}
                        </p>
                      </td>

                      <td className="px-3">
                        <p className="text-[9px] font-medium text-[#4d5362]">
                          {project.expires}
                        </p>
                        {project.expiresTime && (
                          <p
                            className={`mt-1 text-[8px] ${
                              project.status === "Expired"
                                ? "text-[#ef4d5b]"
                                : "text-[#35a95a]"
                            }`}
                          >
                            {project.expiresTime}
                          </p>
                        )}
                      </td>

                      <td className="px-3">
                        <div className="flex items-center gap-1.5">
                          <ActionButton icon={Edit3} />
                          <ActionButton icon={Link2} />
                          <ActionButton icon={MoreVertical} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="divide-y divide-[#eef0f3] md:hidden">
            {filteredProjects.map((project) => {
              const TypeIcon = typeIcons[project.type];

              return (
                <div key={project.id} className="p-4">
                  <div className="flex gap-3">
                    <div className="flex h-12 w-16 shrink-0 items-center justify-center rounded-md bg-[#eef1f7]">
                      <TypeIcon size={21} className="text-[#778092]" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-[12px] font-semibold text-[#34394b]">
                            {project.name}
                          </p>
                          <p className="mt-1 truncate text-[9px] text-[#8a909d]">
                            {project.url}
                          </p>
                        </div>
                        <StatusBadge status={project.status} />
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className={`rounded-md px-2 py-1 text-[8px] font-semibold ${typeStyles[project.type]}`}>
                          {project.type}
                        </span>
                        <span className="rounded-md bg-[#f6f7f9] px-2 py-1 text-[8px] text-[#626978]">
                          Views: {project.views}
                        </span>
                        <span className="rounded-md bg-[#f6f7f9] px-2 py-1 text-[8px] text-[#626978]">
                          Scans: {project.scans}
                        </span>
                        <span className="rounded-md bg-[#f6f7f9] px-2 py-1 text-[8px] text-[#626978]">
                          Shares: {project.shares}
                        </span>
                      </div>

                      <div className="mt-3 flex items-center gap-1.5">
                        <ActionButton icon={Edit3} />
                        <ActionButton icon={Link2} />
                        <ActionButton icon={MoreVertical} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty */}
          {filteredProjects.length === 0 && (
            <div className="px-6 py-14 text-center">
              <FileText className="mx-auto text-[#b4b8c3]" size={28} />
              <p className="mt-3 text-[13px] font-semibold text-[#4d5362]">
                No projects found
              </p>
              <p className="mt-1 text-[11px] text-[#9298a5]">
                Try changing your search or filters.
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="flex flex-col gap-3 border-t border-[#eef0f3] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[9px] text-[#777e8d]">
              Showing 1 to {Math.min(filteredProjects.length, 5)} of 12 projects
            </p>

            <div className="flex items-center gap-1">
              <PageButton
                icon={<ChevronLeft size={13} />}
                disabled={page === 1}
                onClick={() => setPage(Math.max(1, page - 1))}
              />
              {[1, 2, 3].map((number) => (
                <PageButton
                  key={number}
                  label={String(number)}
                  active={page === number}
                  onClick={() => setPage(number)}
                />
              ))}
              <PageButton
                icon={<ChevronRight size={13} />}
                onClick={() => setPage(Math.min(3, page + 1))}
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function SummaryCard({
  title,
  value,
  icon: Icon,
  active = false,
  iconBg = "bg-[#f1eaff]",
  iconColor = "text-[#7254e8]",
}: {
  title: string;
  value: string;
  icon: typeof FileText;
  active?: boolean;
  iconBg?: string;
  iconColor?: string;
}) {
  return (
    <div
      className={`flex h-[68px] items-center gap-3 rounded-lg border bg-white px-4 transition ${
        active
          ? "border-[#b9a7f7] shadow-[0_1px_4px_rgba(114,84,232,0.05)]"
          : "border-[#e9ebef]"
      }`}
    >
      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconBg}`}>
        <Icon size={20} strokeWidth={1.6} className={iconColor} />
      </div>

      <div>
        <p className="text-[9px] font-medium text-[#596071]">{title}</p>
        <p className="mt-0.5 text-[19px] font-bold leading-none text-[#20253a]">
          {value}
        </p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Status }) {
  const styles = {
    Active: "bg-[#e8f8ed] text-[#2da653]",
    Draft: "bg-[#eef0f3] text-[#626978]",
    Expired: "bg-[#ffe9ec] text-[#e84b5a]",
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[8px] font-semibold ${styles[status]}`}>
      <span className="h-[5px] w-[5px] rounded-full bg-current" />
      {status}
    </span>
  );
}

function SelectFilter({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative w-full sm:w-[95px]">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-[35px] w-full appearance-none rounded-md border border-[#e4e6ec] bg-white px-3 pr-7 text-[10px] font-medium text-[#555c6c] outline-none focus:border-[#9b87e8]"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
      <ChevronDown
        size={12}
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#858b98]"
      />
    </div>
  );
}

function ActionButton({
  icon: Icon,
}: {
  icon: typeof Edit3;
}) {
  return (
    <button
      type="button"
      className="flex h-[29px] w-[29px] items-center justify-center rounded-md border border-[#e5e7ed] bg-white text-[#72798a] transition hover:border-[#c9bdf4] hover:bg-[#f8f5ff] hover:text-[#6946dc]"
    >
      <Icon size={13} strokeWidth={1.7} />
    </button>
  );
}

function PageButton({
  label,
  icon,
  active = false,
  disabled = false,
  onClick,
}: {
  label?: string;
  icon?: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`flex h-[25px] min-w-[25px] items-center justify-center rounded-md border text-[9px] font-medium transition ${
        active
          ? "border-[#6941dc] bg-[#6941dc] text-white"
          : "border-[#e3e5eb] bg-white text-[#697081] hover:bg-[#f7f5ff]"
      } ${disabled ? "cursor-not-allowed opacity-40" : ""}`}
    >
      {label || icon}
    </button>
  );
}

function FolderIcon({ size = 20, strokeWidth = 1.6, className = "" }: { size?: number; strokeWidth?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H9l2 2h7.5A2.5 2.5 0 0 1 21 9.5v7A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5v-9Z" />
      <path d="M3 9h18" />
    </svg>
  );
}
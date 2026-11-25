"use client";

import { useRouter } from "next/navigation";
import type { Department } from "@/lib/kudos/kudos-types";
import { DEPARTMENT_PARAM, withFilterParam } from "@/lib/kudos-live/kudos-filters";
import { KUDOS_PATH } from "@/lib/navigation/site-nav";
import { FilterDropdown } from "./filter-dropdown";

type DepartmentFilterProps = { departments: Department[]; selectedId?: string; label: string; emptyLabel: string };

/**
 * B.1.2 Phòng ban filter (MoMorph WXK5AYB_rG): pushes `?department=` (other params kept). The board
 * then shows kudos sent to people of that department (`recipient_department_id`).
 */
export function DepartmentFilter({ departments, selectedId, label, emptyLabel }: DepartmentFilterProps) {
  const router = useRouter();
  const options = departments.map((department) => ({ id: department.id, label: department.code }));

  function handleSelect(id: string | null) {
    router.push(`${KUDOS_PATH}${withFilterParam(window.location.search, DEPARTMENT_PARAM, id)}`, { scroll: false });
  }

  return (
    <FilterDropdown
      label={label}
      options={options}
      selectedId={selectedId}
      onSelect={handleSelect}
      emptyLabel={emptyLabel}
      listClassName="min-w-[101px]"
    />
  );
}

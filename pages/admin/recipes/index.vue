<template>
  <div class="min-h-screen bg-paper-50 dark:bg-paper-950">
    <div class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-start sm:items-center gap-4 mb-6">
        <h1 class="text-2xl sm:text-3xl font-bold text-ink-900 dark:text-paper-50">Manage Recipes</h1>
        <div class="flex gap-4">
          <NuxtLink to="/admin/recipes/new"
            class="bg-brand-primary text-paper-50 px-3 py-2 sm:px-4 rounded-md hover:bg-brand-primary-600 text-sm sm:text-base whitespace-nowrap">
            + Add Recipe
          </NuxtLink>
        </div>
      </div>

      <!-- Search Bar or Bulk Actions -->
      <div class="mb-6 h-12">
        <Transition enter-active-class="transition ease-out duration-150" enter-from-class="opacity-0 -translate-x-2"
          enter-to-class="opacity-100 translate-x-0" leave-active-class="transition ease-in duration-150"
          leave-from-class="opacity-100 translate-x-0" leave-to-class="opacity-0 translate-x-2" mode="out-in">
          <div v-if="selectedRows.length > 0" key="bulk-actions" class="h-full flex items-center">
            <div
              class="bg-paper-50 dark:bg-paper-950 border border-paper-300 dark:border-paper-800 rounded-md px-4 py-3 flex items-center justify-between w-full">
              <span class="text-sm text-ink-800 dark:text-paper-100">{{ selectedRows.length }} recipe{{
                selectedRows.length > 1 ? "s" : ""
              }}
                selected</span>
              <div class="flex items-center gap-4">
                <Button @click="deleteSelected" variant="delete" size="sm" class="flex items-center gap-2">
                  <IconTrash class="w-4 h-4" />
                  Delete selected
                </Button>
                <button @click="table.toggleAllRowsSelected(false)"
                  class="text-brand-primary hover:text-brand-primary text-sm">
                  Clear selection
                </button>
              </div>
            </div>
          </div>
          <div v-else key="search" class="h-full flex items-center">
            <div class="relative max-w-md w-full">
              <input v-model="searchTerm" type="text" placeholder="Search recipes..."
                class="w-full pl-10 pr-4 py-2 border border-paper-400 dark:border-paper-700 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent" />
              <IconSearch class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-ink-500 dark:text-paper-400" />
            </div>
          </div>
        </Transition>
      </div>

      <div v-if="loading" class="text-center py-12">
        <Loader />
      </div>

      <div v-else-if="error" class="text-center py-12">
        <p class="text-error-600">{{ error }}</p>
      </div>

      <div
        v-else
        class="relative overflow-hidden rounded-lg border border-paper-300 bg-paper-50 shadow-md dark:border-paper-800 dark:bg-paper-950"
      >
      <!-- <div v-else class="bg-paper-50 dark:bg-paper-950 rounded-lg shadow-md relative"> -->
        <!-- <div class="overflow-x-auto"> -->
        <table class="min-w-full divide-y divide-paper-300 dark:divide-paper-800">
          <thead class="bg-paper-50 dark:bg-paper-950">
            <tr v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
              <th v-for="(header, index) in headerGroup.headers" :key="header.id" :class="[
                'pl-4 pr-2 py-2 text-left text-xs font-medium text-ink-600 dark:text-paper-300 uppercase tracking-wider',
                index > 0 && headerGroup.headers[index - 1]?.id !== 'select-col' ? 'border-l border-paper-300 dark:border-paper-800' : '',
                header.column.getCanSort()
                  ? 'cursor-pointer hover:bg-paper-100 dark:hover:bg-paper-800 select-none'
                  : '',
                // Mobile: hide select, slug, description, ingredients, time, dates, status
                header.id === 'select-col' ? 'hidden md:table-cell pl-4 pr-2 w-12' : '',
                header.id === 'slug' ? 'hidden md:table-cell' : '',
                header.id === 'description' ? 'hidden md:table-cell w-[12rem]' : '',
                header.id === 'ingredientsCount' ? 'hidden md:table-cell w-[10rem]' : '',
                header.id === 'cookTimeMinutes' ? 'hidden md:table-cell w-[8rem]' : '',
                header.id === 'createdAt' ? 'hidden md:table-cell w-[10rem]' : '',
                header.id === 'updatedAt' ? 'hidden md:table-cell w-[10rem]' : '',
                header.id === 'status' ? 'hidden md:table-cell pl-4 pr-2 w-[10rem]' : '',
                // Title and actions always visible
                header.id === 'title' ? '' : '',
                header.id === 'actions-col' ? 'pr-6 w-20' : '',
              ]" @click="
                header.column.getCanSort()
                  ? header.column.getToggleSortingHandler()?.($event)
                  : null
                ">
                <template v-if="header.id === 'select-col'">
                  <Checkbox :checked="table.getIsAllRowsSelected()" :indeterminate="table.getIsSomeRowsSelected()"
                    @change="table.getToggleAllRowsSelectedHandler()?.($event as any)" />
                </template>
                <template v-else-if="header.id === 'actions-col'">
                  <div class="relative flex items-center justify-end" data-column-visibility-container>
                    <button @click.stop="toggleColumnVisibilityDropdown()"
                      class="hidden md:table-cell p-1 hover:bg-paper-100 dark:hover:bg-paper-800 rounded" data-column-visibility-button>
                      <IconColumns
                        class="shrink-0 transition-all flex items-center justify-center cursor-pointer w-5 h-5" />
                    </button>
                    <Transition enter-active-class="transition ease-out duration-200"
                      enter-from-class="opacity-0 scale-95 -translate-y-1"
                      enter-to-class="opacity-100 scale-100 translate-y-0"
                      leave-active-class="transition ease-in duration-150"
                      leave-from-class="opacity-100 scale-100 translate-y-0"
                      leave-to-class="opacity-0 scale-95 -translate-y-1">
                      <div v-if="showColumnVisibilityDropdown"
                        class="absolute right-0 top-full mt-1 w-56 bg-paper-50 dark:bg-paper-950 rounded-md shadow-lg border border-paper-300 dark:border-paper-800 py-2 z-[1002]"
                        @click.stop>
                        <label v-for="column in table
                          .getAllColumns()
                          .filter(
                            (col) =>
                              col.id !== 'select-col' &&
                              col.id !== 'actions-col'
                          )" :key="column.id"
                          class="flex items-center justify-between px-4 py-2.5 text-sm text-ink-800 dark:text-paper-100 hover:bg-paper-50 dark:hover:bg-paper-800 cursor-pointer">
                          <span>{{ column.columnDef.header || column.id }}</span>
                          <button type="button" @click="column.toggleVisibility()" :class="[
                            'relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2',
                            column.getIsVisible()
                              ? 'bg-brand-primary'
                              : 'bg-paper-300 dark:bg-paper-700',
                          ]" role="switch" :aria-checked="column.getIsVisible()">
                            <span :class="[
                              'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-paper-50 dark:bg-paper-950 shadow ring-0 transition duration-200 ease-in-out',
                              column.getIsVisible()
                                ? 'translate-x-4'
                                : 'translate-x-0',
                            ]" />
                          </button>
                        </label>
                        <div class="border-t border-paper-300 dark:border-paper-800 mt-1 pt-2">
                          <button @click="resetColumnVisibility"
                            class="w-full text-left px-4 py-2 text-sm text-brand-primary hover:bg-paper-50 dark:hover:bg-paper-800">
                            Reset to defaults
                          </button>
                        </div>
                      </div>
                    </Transition>
                  </div>
                </template>
                <div v-else class="flex items-center justify-between">
                  <span v-if="!header.isPlaceholder">
                    <FlexRender :render="header.column.columnDef.header" :props="header.getContext()" />
                  </span>
                  <span v-if="
                    header.column.getCanSort() &&
                    header.id !== 'select-col' &&
                    header.id !== 'actions-col'
                  " class="flex flex-col">
                    <IconChevronUp class="w-3 h-3" :class="header.column.getIsSorted() === 'asc'
                      ? 'text-ink-900 dark:text-paper-50'
                      : 'text-ink-300 dark:text-paper-500'
                      " />
                    <IconChevronDown class="w-3 h-3 -mt-0.5" :class="header.column.getIsSorted() === 'desc'
                      ? 'text-ink-900 dark:text-paper-50'
                      : 'text-ink-300 dark:text-paper-500'
                      " />
                  </span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody class="bg-paper-50 dark:bg-paper-950 divide-y divide-paper-300 dark:divide-paper-800">
            <tr v-for="row in table.getRowModel().rows" :key="row.id" :data-selected="row.getIsSelected()" :class="{
              'bg-brand-primary-50 dark:bg-brand-primary-950': row.getIsSelected(),
              'hover:bg-paper-50 dark:hover:bg-paper-800 transition-colors': true,
            }">
              <td v-for="(cell, cellIndex) in row.getVisibleCells()" :key="cell.id" class="px-4 py-4 text-sm" :class="[
                {
                  'font-medium text-ink-900 dark:text-paper-50': cell.column.id === 'title',
                  'text-ink-600 dark:text-paper-300':
                    cell.column.id !== 'title' &&
                    cell.column.id !== 'actions-col' &&
                    cell.column.id !== 'status',
                  'pl-4 pr-2': cell.column.id === 'select-col',
                  'pr-4': cell.column.id === 'actions-col',
                  'cursor-pointer': cell.column.id === 'title',
                  // Mobile: hide select, slug, description, ingredients, time, dates, status
                  'hidden md:table-cell':
                    cell.column.id === 'select-col' ||
                    cell.column.id === 'slug' ||
                    cell.column.id === 'description' ||
                    cell.column.id === 'ingredientsCount' ||
                    cell.column.id === 'cookTimeMinutes' ||
                    cell.column.id === 'createdAt' ||
                    cell.column.id === 'updatedAt' ||
                    cell.column.id === 'status',
                  // Title can wrap on mobile, other cells use nowrap
                  'whitespace-nowrap': cell.column.id !== 'title',
                },
              ]">
                <template v-if="cell.column.id === 'select-col'">
                  <Checkbox :checked="row.getIsSelected()" :disabled="!row.getCanSelect()"
                    @change="row.getToggleSelectedHandler()?.($event as any)" />
                </template>
                <template v-else-if="cell.column.id === 'actions-col'">
                  <div class="flex justify-end pr-2">
                    <div class="relative w-6" data-dropdown>
                      <button data-dropdown-button @click.stop="toggleActionsDropdown(row.original.id)"
                        class="cursor-pointer p-0.5 hover:bg-paper-100 dark:hover:bg-paper-800 rounded flex items-center justify-center"
                        aria-label="actions-btn">
                        <IconMoreVertical class="w-4 h-4 text-ink-600 dark:text-paper-300" />
                      </button>
                      <Transition enter-active-class="transition ease-out duration-200"
                        enter-from-class="opacity-0 scale-95 -translate-y-1"
                        enter-to-class="opacity-100 scale-100 translate-y-0"
                        leave-active-class="transition ease-in duration-150"
                        leave-from-class="opacity-100 scale-100 translate-y-0"
                        leave-to-class="opacity-0 scale-95 -translate-y-1">
                        <div v-if="openDropdownId === row.original.id" data-dropdown
                          class="absolute right-0 top-full mt-1 w-32 bg-paper-50 dark:bg-paper-950 rounded-md shadow-lg border border-paper-300 dark:border-paper-800 py-1 z-[1002]">
                          <NuxtLink :to="`/admin/recipes/${row.original.id}`"
                            class="block px-4 py-2 text-sm text-ink-800 dark:text-paper-100 hover:bg-paper-100 dark:hover:bg-paper-800" @click="closeDropdown">
                            Edit
                          </NuxtLink>
                          <button @click="
                            deleteRecipe(row.original.id);
                          closeDropdown();
                          " class="block w-full text-left px-4 py-2 text-sm text-ink-800 dark:text-paper-100 hover:bg-paper-100 dark:hover:bg-paper-800">
                            Delete
                          </button>
                        </div>
                      </Transition>
                    </div>
                  </div>
                </template>
                <template v-else-if="cell.column.id === 'title'">
                  <NuxtLink :to="`/admin/recipes/${row.original.id}`"
                    class="block w-full h-full text-brand-primary dark:text-paper-200 hover:text-brand-primary-900 hover:underline font-medium break-words">
                    {{ row.original.title }}
                  </NuxtLink>
                </template>
                <template v-else-if="cell.column.id === 'status'">
                  <div class="flex items-center gap-2">
                    <span :class="[
                      'w-2 h-2 rounded-full',
                      row.original.status === 'publish'
                        ? 'bg-success-600'
                        : 'bg-warning-500',
                    ]"></span>
                    <span :class="['text-ink-700 dark:text-paper-200']">
                      {{
                        row.original.status === "publish"
                          ? "Published"
                          : "Draft"
                      }}
                    </span>
                  </div>
                </template>
                <template v-else>
                  <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                </template>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  useVueTable,
  getCoreRowModel,
  getSortedRowModel,
  FlexRender,
  createColumnHelper,
  type ColumnDef,
} from "@tanstack/vue-table";
import type { Recipe } from '~/types/recipe'
import IconTrash from '~/components/icons/IconTrash.vue'
import IconSearch from '~/components/icons/IconSearch.vue'
import IconChevronUp from '~/components/icons/IconChevronUp.vue'
import IconChevronDown from '~/components/icons/IconChevronDown.vue'
import IconMoreVertical from '~/components/icons/IconMoreVertical.vue'
import IconColumns from '~/components/icons/IconColumns.vue'
import Checkbox from '~/components/Checkbox.vue'
import Button from '~/components/Button.vue'

const recipes = ref<Recipe[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const sorting = ref<any[]>([]);
const rowSelection = ref({});
const openDropdownId = ref<string | null>(null);
const searchTerm = ref("");
const defaultColumnVisibility = {
  title: true,
  slug: true,
  description: false,
  ingredientsCount: true,
  cookTimeMinutes: true,
  createdAt: true,
  updatedAt: false,
  status: true,
};

const columnVisibility = ref({ ...defaultColumnVisibility });
const showColumnVisibilityDropdown = ref(false);

function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

async function publishRecipe(id: string) {
  try {
    await $fetch(`/api/admin/recipes/${id}/approve`, { method: "POST" });
    await fetchRecipes();
  } catch (err) {
    alert("Failed to publish recipe");
  }
}

async function unpublishRecipe(id: string) {
  try {
    await $fetch(`/api/admin/recipes/${id}/unapprove`, { method: "POST" });
    await fetchRecipes();
  } catch (err) {
    alert("Failed to unpublish recipe");
  }
}

async function deleteRecipe(id: string) {
  if (!confirm("Are you sure you want to delete this recipe?")) return;

  try {
    await $fetch(`/api/admin/recipes/${id}`, { method: "DELETE" });

    if (process.client) {
      window.dispatchEvent(
        new CustomEvent("recipe-saved", {
          detail: { message: "Recipe deleted successfully!", type: "error" },
        })
      );
    }

    await fetchRecipes();
  } catch (err) {
    alert("Failed to delete recipe");
  }
}

const columnHelper = createColumnHelper<Recipe>();

const columns = [
  columnHelper.display({
    id: "select-col",
    header: "Select",
    cell: () => "", // Will be rendered in template
    enableSorting: false,
    enableHiding: false,
  }),
  columnHelper.accessor("title", {
    header: "Title",
    cell: (info) => info.getValue(),
    enableHiding: true,
  }),
  columnHelper.accessor("slug", {
    header: "Slug",
    cell: (info) => info.getValue(),
    enableHiding: true,
  }),
  columnHelper.accessor("description", {
    header: "Description",
    cell: (info) => {
      const description = info.getValue();
      if (!description) return "-";
      return description.length > 50 ? description.substring(0, 50) + "..." : description;
    },
    enableHiding: true,
  }),
  columnHelper.accessor(
    (row) => {
      const ingredients = row.ingredients;
      if (!ingredients) return 0;
      return Array.isArray(ingredients) ? ingredients.length : 0;
    },
    {
      id: "ingredientsCount",
      header: "Ingredients",
      cell: (info) => {
        const count = info.getValue();
        return count.toString();
      },
      enableHiding: true,
      enableSorting: true,
    }
  ),
  columnHelper.accessor("cookTimeMinutes", {
    header: "Time",
    cell: (info) => `${info.getValue()} min`,
    enableHiding: true,
  }),
  columnHelper.accessor("createdAt", {
    header: "Added on",
    cell: (info) => formatDate(info.getValue()),
    enableHiding: true,
  }),
  columnHelper.accessor("updatedAt", {
    header: "Updated on",
    cell: (info) => formatDate(info.getValue()),
    enableHiding: true,
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => info.getValue(),
    enableHiding: true,
  }),
  columnHelper.display({
    id: "actions-col",
    header: "",
    enableSorting: false,
    enableHiding: false,
  }),
] as ColumnDef<Recipe>[];

const filteredRecipes = computed(() => {
  if (!searchTerm.value.trim()) {
    return recipes.value;
  }

  const term = searchTerm.value.toLowerCase().trim();
  return recipes.value.filter((recipe) => {
    return (
      recipe.title.toLowerCase().includes(term) ||
      recipe.slug.toLowerCase().includes(term) ||
      recipe.status.toLowerCase().includes(term)
    );
  });
});

const table = useVueTable({
  get data() {
    return filteredRecipes.value;
  },
  columns,
  state: {
    get sorting() {
      return sorting.value;
    },
    get rowSelection() {
      return rowSelection.value;
    },
    get columnVisibility() {
      return columnVisibility.value;
    },
  },
  onSortingChange: (updater) => {
    sorting.value =
      typeof updater === "function" ? updater(sorting.value) : updater;
  },
  onRowSelectionChange: (updater) => {
    rowSelection.value =
      typeof updater === "function" ? updater(rowSelection.value) : updater;
  },
  onColumnVisibilityChange: (updater) => {
    columnVisibility.value =
      typeof updater === "function"
        ? (updater(columnVisibility.value) as typeof columnVisibility.value)
        : (updater as typeof columnVisibility.value);
  },
  enableRowSelection: true,
  getRowId: (row) => row.id,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
});

// Computed for selected rows
const selectedRows = computed(() => {
  return table.getRowModel().rows.filter((row) => row.getIsSelected());
});

onMounted(async () => {
  await fetchRecipes();
});

function toggleActionsDropdown(id: string) {
  if (openDropdownId.value === id) {
    openDropdownId.value = null;
  } else {
    openDropdownId.value = id;
    showColumnVisibilityDropdown.value = false;
  }
}

function toggleColumnVisibilityDropdown() {
  showColumnVisibilityDropdown.value = !showColumnVisibilityDropdown.value;
  if (showColumnVisibilityDropdown.value) {
    openDropdownId.value = null;
  }
}

function resetColumnVisibility() {
  // Reset columns to default visibility state
  table.getAllColumns().forEach((column) => {
    if (column.id !== "select-col" && column.id !== "actions-col") {
      const defaultVisible = defaultColumnVisibility[column.id as keyof typeof defaultColumnVisibility] ?? true;
      const isCurrentlyVisible = column.getIsVisible();

      // Only toggle if current state doesn't match default
      if (isCurrentlyVisible !== defaultVisible) {
        column.toggleVisibility();
      }
    }
  });
  showColumnVisibilityDropdown.value = false;
}

function closeDropdown() {
  openDropdownId.value = null;
  showColumnVisibilityDropdown.value = false;
}

async function deleteSelected() {
  const rowsToDelete = selectedRows.value;
  if (
    !confirm(
      `Are you sure you want to delete ${rowsToDelete.length} recipe(s)?`
    )
  )
    return;

  try {
    for (const row of rowsToDelete) {
      await $fetch(`/api/admin/recipes/${row.original.id}`, {
        method: "DELETE",
      });
    }

    if (process.client) {
      window.dispatchEvent(
        new CustomEvent("recipe-saved", {
          detail: {
            message: `${rowsToDelete.length} recipe(s) deleted successfully!`,
            type: "error",
          },
        })
      );
    }

    table.toggleAllRowsSelected(false);
    await fetchRecipes();
  } catch (err) {
    alert("Failed to delete recipes");
  }
}

// Close dropdown when clicking outside
function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement;
  // Don't close if clicking on the column visibility button or its container
  if (
    !target.closest("[data-dropdown]") &&
    !target.closest("[data-dropdown-button]") &&
    !target.closest("[data-column-visibility-button]") &&
    !target.closest("[data-column-visibility-container]")
  ) {
    openDropdownId.value = null;
    showColumnVisibilityDropdown.value = false;
  }
}

onMounted(async () => {
  await fetchRecipes();
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

async function fetchRecipes() {
  try {
    loading.value = true;
    error.value = null;
    const data = await $fetch<Recipe[]>("/api/admin/recipes");
    recipes.value = data;
  } catch (err: any) {
    if (err.statusCode === 401) {
      await navigateTo("/admin/login");
    } else {
      error.value = "Failed to load recipes";
    }
  } finally {
    loading.value = false;
  }
}
</script>

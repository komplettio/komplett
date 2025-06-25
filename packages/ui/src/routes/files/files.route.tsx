import type { ColumnFiltersState, SortingState } from '@tanstack/react-table';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ChevronDown, ChevronUp, File, FileText, Image, Music, Video } from 'lucide-react';
import { useMemo, useState } from 'react';

import type { FileKind, FileModel, UUID } from '@komplett/core';

import { useFiles } from '#state/queries';
import * as UI from '#ui';
import { formatFileSize } from '#utils/formatters';

import './files.route.scss';

import { useDeleteFiles } from '#state/mutations/file.mutations.js';

const columnHelper = createColumnHelper<FileModel>();

export default function FilesRoute() {
  const deleteFiles = useDeleteFiles();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<FileKind | 'all'>('all');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());

  const { data: files } = useFiles();

  const handleClickFile = (file: FileModel) => {
    console.log(file);
  };

  const handleDeleteFile = (fileId: UUID) => {
    deleteFiles.mutate([fileId]);
  };
  // Filter files based on search and kind
  const filteredFiles = useMemo(() => {
    if (!files) return [];

    let filtered = files;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        file => file.name.toLowerCase().includes(query) || file.kind.toLowerCase().includes(query),
      );
    }

    // Apply kind filter
    if (filterType !== 'all') {
      filtered = filtered.filter(file => file.kind === filterType);
    }

    return filtered;
  }, [files, searchQuery, filterType]);

  const getFileIcon = (kind: FileKind) => {
    switch (kind) {
      case 'image':
        return Image;
      case 'video':
        return Video;
      case 'audio':
        return Music;
      case 'document':
        return FileText;
      default:
        return File;
    }
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Name',
        cell: ({ row }) => {
          const file = row.original;
          const IconComponent = getFileIcon(file.kind);

          return (
            <div className="file-info">
              <IconComponent size={20} className={`file-icon ${file.kind}`} />
              <div className="file-details">
                <h4 className="file-name">{file.name}</h4>
              </div>
            </div>
          );
        },
        enableSorting: true,
      }),
      columnHelper.accessor('kind', {
        header: 'Type',
        cell: ({ getValue }) => {
          const kind = getValue();
          const IconComponent = getFileIcon(kind);

          return (
            <div className={`kind-badge ${kind}`}>
              <IconComponent size={14} />
              {kind}
            </div>
          );
        },
        enableSorting: true,
      }),
      columnHelper.accessor('originalFileId', {
        header: 'Original File',
        cell: ({ getValue }) => {
          const originalFileId = getValue();
          const originalFile = files?.find(file => file.id === originalFileId);
          return originalFileId ? <span className="original-file-id">{originalFile?.name}</span> : '-';
        },
        enableSorting: false,
      }),
      columnHelper.accessor('project.name', {
        header: 'Project',
        cell: ({ getValue }) => <span>{getValue()}</span>,
        enableSorting: true,
      }),
      columnHelper.accessor('size', {
        header: 'Size',
        cell: ({ getValue }) => <span className="file-size">{formatFileSize(getValue())}</span>,
        enableSorting: true,
      }),
      columnHelper.accessor('updatedAt', {
        header: 'Modified',
        cell: ({ getValue }) => (
          <span className="file-date">
            {new Intl.DateTimeFormat('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }).format(getValue())}
          </span>
        ),
        enableSorting: true,
      }),
      columnHelper.accessor('createdAt', {
        header: 'Added',
        cell: ({ getValue }) => (
          <span className="file-date">
            {new Intl.DateTimeFormat('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }).format(getValue())}
          </span>
        ),
        enableSorting: true,
      }),
    ],
    [],
  );

  // React Table instance
  const table = useReactTable({
    data: filteredFiles,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter: searchQuery,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="files-route">
      <h1>Files</h1>
      <div className="files-table-container">
        <table className="files-table">
          <thead className="table-header">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className={`header-cell ${header.column.getCanSort() ? 'sortable' : ''} ${
                      ['kind', 'status'].includes(header.id) ? 'mobile-hidden' : ''
                    }`}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getCanSort() && (
                      <span className={`sort-indicator ${header.column.getIsSorted() ? 'active' : ''}`}>
                        {header.column.getIsSorted() === 'asc' && <ChevronUp size={14} />}
                        {header.column.getIsSorted() === 'desc' && <ChevronDown size={14} />}
                        {!header.column.getIsSorted() && <ChevronDown size={14} />}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="table-body">
            {table.getRowModel().rows.map(row => (
              <UI.ContextMenu.Root key={row.id}>
                <UI.ContextMenu.Trigger asChild>
                  <tr
                    className={`table-row ${selectedFiles.has(row.original.id) ? 'selected' : ''}`}
                    onClick={() => {
                      handleClickFile(row.original);
                    }}
                  >
                    {row.getVisibleCells().map(cell => (
                      <td
                        key={cell.id}
                        className={`table-cell ${['kind', 'status'].includes(cell.column.id) ? 'mobile-hidden' : ''}`}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                </UI.ContextMenu.Trigger>

                <UI.ContextMenu.Portal>
                  <UI.ContextMenu.Content>
                    <UI.ContextMenu.Label>Actions</UI.ContextMenu.Label>
                    <UI.ContextMenu.Item
                      onClick={() => {
                        handleDeleteFile(row.original.id);
                      }}
                    >
                      Delete
                    </UI.ContextMenu.Item>
                  </UI.ContextMenu.Content>
                </UI.ContextMenu.Portal>
              </UI.ContextMenu.Root>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import { cn } from '@web/lib/utils';
import * as React from 'react';

type TableHeight = 'compact' | 'default' | 'relaxed' | 'large';

interface TableContextValue {
  headerHeight: TableHeight;
  rowHeight: TableHeight;
}

const TableContext = React.createContext<TableContextValue>({
  headerHeight: 'default',
  rowHeight: 'default',
});

interface TableProps extends React.ComponentProps<'table'> {
  headerHeight?: TableHeight;
  rowHeight?: TableHeight;
}

function Table({
  className,
  headerHeight = 'default',
  rowHeight = 'default',
  ...props
}: TableProps) {
  const contextValue = React.useMemo(
    () => ({ headerHeight, rowHeight }),
    [headerHeight, rowHeight],
  );

  return (
    <TableContext value={contextValue}>
      <div data-slot="table-container" className="relative w-full">
        <table
          data-slot="table"
          className={cn(
            'border-border w-full caption-bottom border-collapse border text-sm',
            className,
          )}
          {...props}
        />
      </div>
    </TableContext>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<'thead'>) {
  return (
    <thead
      data-slot="table-header"
      className={cn('border-border [&_tr]:border-b', className)}
      {...props}
    />
  );
}

function TableBody({ className, ...props }: React.ComponentProps<'tbody'>) {
  return (
    <tbody
      data-slot="table-body"
      className={cn('[&_tr:last-child]:border-0', className)}
      {...props}
    />
  );
}

function TableFooter({ className, ...props }: React.ComponentProps<'tfoot'>) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        'border-t-1 border-border border-b-0 border-l-0 border-r-0 font-medium'
        + ' [&>tr]:last:border-b-0',
        className,
      )}
      {...props}
    />
  );
}

function TableRow({ className, ...props }: React.ComponentProps<'tr'>) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        'hover:bg-muted/50 data-[state=selected]:bg-muted border-border border-b transition-colors',
        className,
      )}
      {...props}
    />
  );
}

function TableHead({ className, ...props }: React.ComponentProps<'th'>) {
  const { headerHeight } = React.use(TableContext);

  const paddingClasses = {
    compact: 'py-2',
    default: 'py-3',
    relaxed: 'py-4',
    large: 'py-6',
  };

  return (
    <th
      data-slot="table-head"
      className={cn(
        'text-foreground px-2 text-left align-middle font-medium',
        paddingClasses[headerHeight],
        '[&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
        className,
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: React.ComponentProps<'td'>) {
  const { rowHeight } = React.use(TableContext);

  const paddingClasses = {
    compact: 'py-2',
    default: 'py-3',
    relaxed: 'py-4',
    large: 'py-6',
  };

  return (
    <td
      data-slot="table-cell"
      className={cn(
        'whitespace-nowrap px-2 align-middle',
        paddingClasses[rowHeight],
        '[&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
        className,
      )}
      {...props}
    />
  );
}

function TableCaption({ className, ...props }: React.ComponentProps<'caption'>) {
  return (
    <caption
      data-slot="table-caption"
      className={cn('text-muted-foreground mt-4 text-sm', className)}
      {...props}
    />
  );
}

export { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow };

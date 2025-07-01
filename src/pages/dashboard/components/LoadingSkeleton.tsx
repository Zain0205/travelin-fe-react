import { Skeleton } from "@/components/ui/skeleton"
import { TableCell, TableRow } from "@/components/ui/table"

function LoadingSkeleton() {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center space-x-3">
          <Skeleton className="w-12 h-12 rounded-lg" />
          <Skeleton className="w-32 h-4" />
        </div>
      </TableCell>
      <TableCell>
        <Skeleton className="w-20 h-4" />
      </TableCell>
      <TableCell>
        <Skeleton className="w-24 h-4" />
      </TableCell>
      <TableCell>
        <Skeleton className="w-16 h-4" />
      </TableCell>
      <TableCell>
        <Skeleton className="w-20 h-4" />
      </TableCell>
      <TableCell>
        <Skeleton className="w-16 h-4" />
      </TableCell>
      <TableCell>
        <div className="flex space-x-2">
          <Skeleton className="w-8 h-8" />
          <Skeleton className="w-8 h-8" />
          <Skeleton className="w-8 h-8" />
        </div>
      </TableCell>
    </TableRow>
  )
}

export default LoadingSkeleton

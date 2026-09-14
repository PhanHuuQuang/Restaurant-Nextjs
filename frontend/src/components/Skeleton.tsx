interface SkeletonProps {
  error?: string;
}

export function ErrorBanner({ message }: { message: string; }) {
  return (
    <div className="w-full p-4 text-center text-red-500 bg-red-50">
      {message}
    </div>
  );
}

export function FeaturedSkeleton({ error }: SkeletonProps) {
  return (
    <div className="w-full">
      {error && <ErrorBanner message={error} />}
      <div className="w-full overflow-x-scroll text-red-500">
        <div className="w-max flex">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-screen h-[60vh] flex flex-col items-center justify-around p-4 md:w-[50vw] xl:w-[33vw] xl:h-[90vh]"
            >
              <div className="relative flex-1 w-full rounded-md bg-gray-200 animate-pulse" />
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 w-full">
                <div className="h-6 w-2/3 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
                <div className="h-8 w-24 bg-gray-200 rounded-md animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function MenuPageSkeleton({ error }: SkeletonProps) {
  return (
    <div className="p-4 lg:px-20 xl:px-40 h-[calc(100vh-6rem)] md:h-[calc(100vh-9rem)] flex flex-col md:flex-row items-center">
      {error && <ErrorBanner message={error} />}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-full h-1/3 bg-gray-200 animate-pulse p-6 flex flex-col justify-end gap-4 md:h-[70%]"
        >
          <div className="h-8 w-1/2 bg-gray-300 rounded animate-pulse" />
          <div className="h-3 w-2/3 bg-gray-300 rounded animate-pulse" />
          <div className="h-8 w-20 bg-gray-300 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}

export function CategoryGridSkeleton({ error }: SkeletonProps) {
  return (
    <div className="flex flex-wrap text-red-500">
      {error && <ErrorBanner message={error} />}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="w-full h-[60vh] border-r-2 border-b-2 border-red-500 sm:w-1/2 lg:w-1/3 p-4 flex flex-col justify-between"
        >
          <div className="h-[80%] bg-gray-200 rounded-md animate-pulse" />
          <div className="flex items-center justify-between gap-4">
            <div className="h-6 w-1/2 bg-gray-200 rounded animate-pulse" />
            <div className="h-6 w-12 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProductPageSkeleton({ error }: SkeletonProps) {
  return (
    <div className="p-4 lg:px-20 xl:px-40 h-screen flex flex-col justify-around text-red-500 md:flex-row md:gap-8 md:items-center">
      {error && <ErrorBanner message={error} />}
      <div className="relative w-full h-1/2 bg-gray-200 rounded-md animate-pulse md:h-[70%]" />
      <div className="h-1/2 flex flex-col gap-4 md:h-[70%] md:justify-center md:gap-6 xl:gap-8">
        <div className="h-10 w-3/4 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
        <div className="h-10 w-40 bg-gray-200 rounded-md animate-pulse" />
        <div className="h-10 w-full bg-red-200 rounded-md animate-pulse" />
      </div>
    </div>
  );
}

export default function Skeleton() {
  return (
    <div className="p-6 space-y-4 animate-pulse">
      <div className="flex items-center space-x-4">
        <div className="h-40 w-full bg-gray-200 rounded"></div>
      </div>
      <div className="h-40 w-full bg-gray-200 rounded"></div>
    </div>
  );
}
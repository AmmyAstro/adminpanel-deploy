export default function Skenton() {
  return (
    <section className="flex flex-col items-center w-full p-4 sm:p-6">
      <div className="animate-pulse w-full max-w-7xl">
        {/* <div className="flex justify-between items-center mb-6">
          <div className="h-6 bg-gray-300 dark:bg-gray-200 rounded w-40"></div>
          <div className="h-8 bg-gray-300 dark:bg-gray-200 rounded w-24"></div>
        </div> */}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="p-4 border border-gray-200 dark:border-gray-200 rounded-2xl bg-gray-100 dark:bg-gray-200"
            >
              <div className="h-24 bg-gray-300 dark:bg-gray-100 rounded-xl mb-3"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-100 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-100 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

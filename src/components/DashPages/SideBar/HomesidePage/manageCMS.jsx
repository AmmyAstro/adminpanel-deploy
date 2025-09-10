"use client";

export default function ManageCMS() { 
  return (
    <section className="ml-0 bg-[#928f8f34] p-6 rounded-lg">
      <div>
        <h3 className="text-2xl font-bold mb-6">Welcome to manage cms </h3>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="flex flex-col items-center bg-white shadow-md rounded-xl p-6">
            <img src="/img/12.png" alt="Users" className="w-20 h-20 object-contain mb-4" />
            <div className="text-center">
              <h3 className="text-lg font-semibold">Users</h3>
              <span className="text-xl font-bold text-purple-600">180000</span>
            </div>
          </div>

          <div className="flex flex-col items-center bg-white shadow-md rounded-xl p-6">
            <img src="/img/user2.png" alt="Team Members" className="w-20 h-20 object-contain mb-4" />
            <div className="text-center">
              <h3 className="text-lg font-semibold">Team Members</h3>
              <span className="text-xl font-bold text-purple-600">180000</span>
            </div>
          </div>

          <div className="flex flex-col items-center bg-white shadow-md rounded-xl p-6">
            <img src="/img/grp.gif" alt="Revenue" className="w-20 h-20 object-contain mb-4" />
            <div className="text-center">
              <h3 className="text-lg font-semibold">Revenue</h3>
              <span className="text-xl font-bold text-purple-600">180000</span>
            </div>
          </div>
        </div>

        {/* Cards Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white shadow-md rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-2">Total Earnings</h3>
            <p className="text-gray-600">"Unlock your destiny with Dhwani Astro"</p>
          </div>

          <div className="bg-white shadow-md rounded-xl p-6">
            <h5 className="text-lg font-semibold mb-2">Have to show something</h5>
            <p className="text-gray-600">"Unlock your destiny with Dhwani Astro"</p>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";
import Link from "next/link";
import Image from "next/image";
import CustomButton from "@/components/Custom/CustomButtom";
// import { MessageSquare, Heart } from "lucide-react";

export default function BlogMain() {
    return (
        <div className=" ml-0 bg-[#928f8f34] p-4 rounded-lg">
         
                <div className="text-2xl font-bold mb-4 text-center">Blog Section</div>

                <div className="flex flex-col lg:flex-row gap-6"> 
                    <div className="flex-1 grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden">
                                <Image
                                    src="/admin-img/blog-img1.jpg"
                                    alt="blog image"
                                    className="w-full h-48 object-cover" height={192} width={192} />
                                <div className="py-2 px-2 flex flex-col gap-1">
                                    <h5 className="text-base font-semibold text-indigo-700">
                                        Today’s Horoscope: Astrological Prediction for 13 June 2024
                                    </h5>

                                    <div className="flex items-center gap-2  text-sm text-gray-600">
                                        <img
                                            className="w-8 h-8 rounded-full"
                                            src="/admin-img/blog-img1.jpg"
                                            alt="author" />
                                        <span>by</span>
                                        <Link href="#" className="font-medium text-indigo-600">
                                            Dhwani Astro
                                        </Link>
                                        <span>| Jun 12 2024</span>
                                    </div>

                                    <p className="text-sm text-gray-500 ">
                                        Discover your daily astrological predictions for June 13,
                                        2024, and find out how the stars might influence your love
                                        life, health, money, and career.
                                    </p>

                                    <div className="flex justify-between items-center text-sm">
                                        <Link
                                            href="#"
                                            className="flex items-center gap-1 text-gray-500 hover:text-indigo-600"
                                        >
                                            {/* <MessageSquare className="w-4 h-4" /> 0 Comments */}
                                        </Link>
                                        {/* <Link
                                            href="#"
                                            className="text-gray-100 px-2 py-1 bg-green-300 border border-green-100 rounded-full text-xs font-xs hover:underline"
                                        >
                                            Read More
                                        </Link> */}
                                        <div className="flex gap-2">
                                            <CustomButton variant={"green"} className="px-2 py-1 text-xs">
                                                Edit
                                            </CustomButton>
                                            <CustomButton variant={"red"} className="px-2 py-1 text-xs">
                                                Delete
                                            </CustomButton>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Sidebar */}
                    <div className="w-full lg:w-80 flex flex-col gap-6">
                        {/* Recent Posts */}
                        <div className="bg-white p-4 flex flex-col gap-2 rounded-xl shadow">
                            <h6 className="text-center font-semibold">RECENT POSTS</h6>
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className=" bg-[#7a5ba3bc] rounded-2xl px-4 py-1 hover:scale-103 transition block">
                                    <Link href="#" className="">
                                        <h5 className="text-sm text-white font-medium">
                                            Today’s Horoscope: Astrological Prediction for 13 June 2024
                                        </h5>
                                    </Link>
                                    <span className="text-xs text-gray-100">Jun 12 2024</span>
                                </div>
                            ))}
                        </div>

                        {/* Categories */}
                        <div className="bg-white p-4 rounded-xl shadow">
                            <h6 className="text-center font-semibold">CATEGORIES</h6>
                            <hr className="my-2" />
                            <div className="flex flex-col gap-3 text-sm text-gray-600">
                                {[
                                    "Tarot",
                                    "Vastu",
                                    "Vedic",
                                    "Transits",
                                    "Compatibility",
                                    "Jamini Sutras",
                                ].map((cat) => (
                                    <div key={cat} className="flex items-center gap-2">
                                        {/* <Heart className="w-4 h-4 text-pink-500" /> */}
                                        <Link
                                            href="#"
                                            className="hover:text-indigo-600 transition font-medium"
                                        >
                                            {cat}
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
    
        </div>
    );
}

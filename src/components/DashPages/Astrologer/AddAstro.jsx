"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addAstrologerSchema } from "../../../app/schema/addAstrologer.schema";
import Image from "next/image";

import CustomDropdown from "@/components/Custom/CustomDropdown";
import CustomInput from "@/components/Custom/CustomInput";
import CustomButton from "@/components/Custom/CustomButtom";

export default function AddAstro() {
    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(addAstrologerSchema),
        defaultValues: {
            gender: "ml",
        },
    });

    const onSubmit = (data) => {
        console.log("FORM DATA 👉", data);
        alert("Submit working — check console");
        reset();
    };

    return (
        <div className="min-h-screen">
            <div className="shadow-md rounded-xl p-3 bg-purple-200 mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-purple-900">
                    Add New Astrologer
                </h2>
                <Image
                    src="/admin-img/wired-flat-21-avatar.gif"
                    alt="astrologer"
                    width={50}
                    height={50}
                    className="rounded-full"
                />
            </div>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white shadow-lg rounded-2xl p-5 space-y-6">
                <h2 className=" mb-2 text-base font-semibold text-purple-500">
                    Basic Astrologer Details :
                </h2>


                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                            Astrologer Full Name
                        </label>
                        <div className="flex items-center gap-2 border border-gray-400 rounded-full px-2 p-1">
                            <img
                                src="/admin-img/userte.png"
                                alt="user"
                                className="input-img-side"
                            />
                            <CustomInput className="w-full outline-none border-0 border-none bg-transparent"
                                {...register("astroname")}
                                placeholder="Enter full name"
                            />


                        </div>
                        {errors.astroname && (
                            <p className="text-red-500 text-xs">
                                {errors.astroname.message}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                            Display Name
                        </label>
                        <div className="flex items-center gap-2 border border-gray-400 rounded-full px-2 p-1">
                            <img
                                src="/admin-img/userte.png"
                                alt="user"
                                className="input-img-side"
                            />

                            <CustomInput className="w-full outline-none border-0 border-none bg-transparent"
                                {...register("displayName")}
                                placeholder="Enter display name"
                            />

                        </div>
                        {errors.displayName && (
                            <p className="text-red-500 text-xs">
                                {errors.displayName.message}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                            Display Name (Hindi)
                        </label>
                        <div className="flex items-center gap-2 border border-gray-400 rounded-full px-2 p-1">
                            <img
                                src="/admin-img/userte.png"
                                alt="user"
                                className="input-img-side"
                            />

                            <CustomInput className="w-full outline-none border-0 border-none bg-transparent"
                                {...register("hindiName")}
                                placeholder="Enter name in hindi"
                            />

                        </div>
                        {errors.hindiName && (
                            <p className="text-red-500 text-xs">
                                {errors.hindiName.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                            Phone Number
                        </label>
                        <div className="flex items-center gap-2 border border-gray-400 rounded-full px-2 p-1">
                            <img
                                src="/admin-img/userte.png"
                                alt="user"
                                className="input-img-side"
                            />
                            <CustomInput className="w-full outline-none border-0 border-none bg-transparent"
                                type="number"
                                placeholder="Enter phone number"
                                {...register("phoneNumber", { valueAsNumber: true })}
                            />
                        </div>
                        {errors.phoneNumber && (
                            <p className="text-red-500 text-xs">{errors.phoneNumber.message}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                            Email Address
                        </label>
                        <div className="flex items-center gap-2 border border-gray-400 rounded-full px-2 p-1">
                            <img
                                src="/admin-img/userte.png"
                                alt="user"
                                className="input-img-side"
                            />

                            <CustomInput className="w-full outline-none border-0 border-none bg-transparent"
                                {...register("email")}
                                placeholder="Enter email"
                            />

                        </div>
                        {errors.email && (
                            <p className="text-red-500 text-xs">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-500    mb-1">
                            Years of Experience
                        </label>
                        <div className="flex items-center gap-2 border border-gray-400 rounded-full px-2 p-1">
                            <img
                                src="/admin-img/userte.png"
                                alt="user"
                                className="input-img-side"
                            />
                            <CustomInput
                                className="w-full outline-none border-0 border-none bg-transparent"
                                type="number" placeholder="Enter experience in years"
                                {...register("experience", { valueAsNumber: true })}
                            />
                        </div>
                        {errors.address && (
                            <p className="text-red-500 text-xs">{errors.address.message}</p>
                        )}
                    </div>


                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                            Address
                        </label>
                        <div className="flex items-center gap-2 border border-gray-400 rounded-2xl px-2 p-1">
                            <img
                                src="/admin-img/userte.png"
                                alt="user"
                                className="input-img-side rounded-full"
                            />
                            <CustomInput className="w-full outline-none border-0 border-none bg-transparent"
                                {...register("address")}
                                placeholder="Enter address"
                            />
                            {errors.address && (
                                <p className="text-red-500 text-xs">
                                    {errors.address.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <Controller
                        name="gender"
                        control={control}
                        render={({ field }) => (
                            <CustomDropdown
                                {...field}
                                label="Gender"
                                options={[
                                    { value: "ml", label: "Male" },
                                    { value: "fe", label: "Female" },
                                ]}
                            />
                        )}
                    />
                    {errors.gender && (
                        <p className="text-red-500 text-xs">{errors.gender.message}</p>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-500    mb-1">
                            Pincode
                        </label>
                        <div className="flex items-center gap-2 border border-gray-400 rounded-full px-2 p-1">
                            <img
                                src="/admin-img/userte.png"
                                alt="user"
                                className="input-img-side"
                            />
                            <CustomInput
                                className="w-full outline-none border-0 border-none bg-transparent"
                                type="number" placeholder="Enter pincode"
                                {...register("pincode", { valueAsNumber: true })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-500    mb-1">
                            Password
                        </label>
                        <div className="flex items-center gap-2 border border-gray-400 rounded-full px-2 p-1">
                            <img
                                src="/admin-img/userte.png"
                                alt="user"
                                className="input-img-side"
                            />
                            <CustomInput type="password" className="w-full outline-none border-0 border-none bg-transparent" {...register("password")} />
                            {errors.password && (
                                <p className="text-red-500 text-xs">{errors.password.message}</p>
                            )}
                        </div>
                    </div>


                </div>











                <div className="flex gap-4 items-center justify-center">
                    <CustomButton type="submit" variant="green" className="px-4 py-1">
                        Save Astrologer
                    </CustomButton>

                    <CustomButton type="button" variant="gray" className="px-4 py-1" onClick={() => reset()}>
                        Reset
                    </CustomButton>
                </div>
            </form>
        </div>
    );
}

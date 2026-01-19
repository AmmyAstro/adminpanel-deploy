
"use client";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addAstrologerSchema } from "../../../app/schema/addAstrologer.schema";
import Image from "next/image";

import CustomDropdown from "@/components/Custom/CustomDropdown";
import CustomInput from "@/components/Custom/CustomInput";
import CustomButton from "@/components/Custom/CustomButtom";
import TapEditor from "@/components/Custom/TapEditor";
import MultiSelect from "@/components/Custom/MultiSelect";
import AstroProCharge from "@/components/Data/AstroProCharge";
import { useEffect, useState } from "react";
import CSC from "@/components/Custom/CSC";
export default function AddAstro() {

    const [activeTab, setActiveTab] = useState("call");

    const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
        resolver: zodResolver(addAstrologerSchema),
        defaultValues: {
            gender: "ml",
            tags: "new",
            vtags: "noverify",
            expertise: [],
            languages: [],
            problems: [],
            aboutEnglish: "",
            aboutHindi: "",

            charges: {
                callCharges: "",
                callCommission: "",
                videocall_charges: "",
                videocall_commission: "",
                audiocall_charges: "",
                audiocall_commission: "",
                offercallcharges: "",
                offervideocharges: "",
                disc_chat_charge: "",
                gift_commission: "",
            },

            bankDetails: {
                accountHolderName: "",
                accountNumber: "",
                bankName: "",
                ifscCode: "",
                panCardNumber: "",
                branchName: "",
                documents: {
                    profile: null,
                    aadhar: null,
                    pan: null,
                    passbook: null,
                },
            },
        },
    });




    const selectFields = [
        {
            label: "Skills & Expertise",
            name: "expertise",
            placeholder: "Select Expertise",
            options: ["Palmistry", "Face Reading", "Tarot", "Numerology"],
        },
        {
            label: "Language Known",
            name: "languages",
            placeholder: "Select Language",
            options: ["English", "Hindi", "Punjabi", "Malayalam, "],
        },
        {
            label: "Problems Handled",
            name: "problems",
            placeholder: "Select Problems",
            options: ["Love", "Career", "Health", "Finance"],
        },
    ];


    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            console.log("❌ FORM ERRORS:", errors);
        }
    }, [errors]);


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

                        </div>
                        {errors.address && (<p className="text-red-500 text-xs"> {errors.address.message}
                        </p>
                        )}
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
                        {errors.pincode && (
                            <p className="text-red-500 text-xs">{errors.pincode.message}</p>
                        )}
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

                        </div>
                        {errors.password && (
                            <p className="text-red-500 text-xs">{errors.password.message}</p>
                        )}
                    </div>
                    {/* <CSC/> */}


                </div>


                <h2 className=" mb-2 text-base font-semibold text-purple-500">
                    About Astrologer :
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                            About Me (in English)
                        </label>
                        <div className="flex items-center gap-2 border border-gray-400 rounded-2xl px-2 p-1">
                            <Controller
                                name="aboutEnglish"
                                control={control}
                                render={({ field }) => (
                                    <TapEditor
                                        value={field.value}
                                        onChange={field.onChange}
                                        placeholder="About astrologer (English)"
                                    />
                                )}
                            />

                        </div>
                        {errors.aboutEnglish && (
                            <p className="text-red-500 text-xs">{errors.aboutEnglish.message}</p>
                        )}

                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                            About Me (in Hindi)
                        </label>
                        <div className="flex items-center gap-2 border border-gray-400 rounded-2xl px-2 p-1">

                            <Controller
                                name="aboutHindi"
                                control={control}
                                render={({ field }) => (
                                    <TapEditor
                                        value={field.value}
                                        onChange={field.onChange}
                                        placeholder="About astrologer (Hindi)"
                                    />
                                )}
                            />


                        </div>
                        {errors.aboutHindi && (
                            <p className="text-red-500 text-xs">{errors.aboutHindi.message}</p>
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        {selectFields.map((field, idx) => (
                            <Controller
                                key={idx}
                                name={field.name}
                                control={control}
                                render={({ field: rhfField }) => (
                                    <MultiSelect
                                        label={field.label}
                                        options={field.options}
                                        placeholder={field.placeholder}
                                        multiple
                                        selected={rhfField.value}
                                        setSelected={rhfField.onChange}
                                    />
                                )}
                            />
                        ))}
                        {errors.label && (
                            <p className="text-red-500 text-xs">{errors.label.message}</p>
                        )}
                    </div>



                    <div className="flex w-full">
                        <div className="p-4 rounded-xl flex flex-col gap-2 border border-gray-400 bg-white w-full">
                            <h2 className="font-semibold text-sm text-center">
                                Astrologer Charges
                            </h2>


                            <div className="flex gap-3 justify-center">
                                {AstroProCharge.map((tab) => (
                                    <button
                                        type="button"
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`px-4 py-1 text-sm font-medium rounded-full transition ${activeTab === tab.id
                                            ? "bg-purple-400 text-white"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                            }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>


                            <div className="p-4 shadow rounded-lg bg-purple-100">
                                {AstroProCharge.map(
                                    (tab) =>
                                        activeTab === tab.id && (
                                            <table key={tab.id} className="w-full text-sm">
                                                <tbody>
                                                    {tab.fields.map((field, idx) => (
                                                        <tr key={idx}>
                                                            <td className="py-2 pr-4">{field.label} :</td>
                                                            <td>
                                                                {field.prefix}
                                                                <Controller
                                                                    name={field.name}
                                                                    control={control}
                                                                    render={({ field: rhfField }) => (
                                                                        <input
                                                                            {...rhfField}
                                                                            type="number"
                                                                            max={field.max}
                                                                            className="border rounded-md px-2 py-1 w-20 ml-1 text-center"
                                                                            onChange={(e) =>
                                                                                rhfField.onChange(Number(e.target.value))
                                                                            }
                                                                        />
                                                                    )}
                                                                />
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )
                                )}
                            </div>
                        </div>
                    </div>

                    {errors?.charges?.callCharges && (
                        <p className="text-red-500 text-xs">
                            {errors.charges.callCharges.message}
                        </p>
                    )}

                    <Controller
                        name="tags"
                        control={control}
                        render={({ field }) => (
                            <CustomDropdown
                                {...field}
                                className="focus:outline-none  focus:ring-0"
                                label="Astrologer Tag"

                                options={[
                                    { value: "new", label: "New" },
                                    { value: "rs", label: "Rising Star" },
                                    { value: "cl", label: "Celebrity" },
                                    { value: "tp", label: "Top Ranking" },
                                    { value: "tc", label: "Top Choice" },
                                ]}
                            />
                        )} />
                    {errors.tags && (
                        <p className="text-red-500 text-xs">{errors.tags.message}</p>
                    )}

                    <Controller
                        name="vtags"
                        control={control}
                        render={({ field }) => (
                            <CustomDropdown
                                {...field}
                                className="focus:outline-none  focus:ring-0"
                                label="Astrologer Verification Tag"


                                required
                                options={[
                                    { value: "verify", label: "Verified" },
                                    { value: "noverify", label: "Not Verified" },
                                ]}
                            />)} />
                    {errors.vtags && (
                        <p className="text-red-500 text-xs">{errors.vtags.message}</p>
                    )}



                </div>


                <div className="bg-white shadow-lg rounded-2xl p-5 space-y-6">
                    <h2 className=" mb-2 text-base font-semibold text-purple-500">
                        Astrologer Bank Details :
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">
                                Account Holder Name
                            </label>
                            <div className="flex items-center gap-2 border border-gray-400 rounded-full px-2 p-1">
                                <img
                                    src="/admin-img/userte.png"
                                    alt="user"
                                    className="input-img-side"
                                />
                                <CustomInput
                                    className="w-full outline-none border-0 border-none bg-transparent"
                                    type="text"
                                    placeholder="Enter account holder name"
                                    {...register("bankDetails.accountHolderName")}
                                />
                            </div>
                            {errors?.bankDetails?.accountHolderName && (
                                <p className="text-xs text-red-500">
                                    {errors.bankDetails.accountHolderName.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">
                                Account No :
                            </label>
                            <div className="flex items-center gap-2 border border-gray-400 rounded-full px-2 p-1">
                                <img
                                    src="/admin-img/userte.png"
                                    alt="user"
                                    className="input-img-side"
                                />
                                <CustomInput
                                    className="w-full outline-none border-0 border-none bg-transparent"
                                    type="text"
                                    placeholder="Enter account number"
                                    {...register("bankDetails.accountNumber")}
                                />
                            </div>
                            {errors?.bankDetails?.accountNumber && (
                                <p className="text-xs text-red-500">
                                    {errors.bankDetails.accountNumber.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">
                                Bank Name
                            </label>
                            <div className="flex items-center gap-2 border border-gray-400 rounded-full px-2 p-1">
                                <img
                                    src="/admin-img/userte.png"
                                    alt="user"
                                    className="input-img-side"
                                />
                                <CustomInput
                                    className="w-full outline-none border-0 border-none bg-transparent"
                                    type="text" placeholder="Enter bank name"
                                    {...register("bankDetails.bankName")}
                                />
                            </div>
                            {errors?.bankDetails?.bankName && (
                                <p className="text-xs text-red-500">
                                    {errors.bankDetails.bankName.message}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">
                                IFSC Code
                            </label>
                            <div className="flex items-center gap-2 border border-gray-400 rounded-full px-2 p-1">
                                <img
                                    src="/admin-img/userte.png"
                                    alt="user"
                                    className="input-img-side"
                                />
                                <CustomInput
                                    className="w-full outline-none border-0 border-none bg-transparent"
                                    type="text" placeholder="Enter IFSC code"
                                    {...register("bankDetails.ifscCode")}
                                />
                            </div>
                            {errors?.bankDetails?.ifscCode && (
                                <p className="text-xs text-red-500">
                                    {errors.bankDetails.ifscCode.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">
                                Branch Name
                            </label>
                            <div className="flex items-center gap-2 border border-gray-400 rounded-full px-2 p-1">
                                <img
                                    src="/admin-img/userte.png"
                                    alt="user"
                                    className="input-img-side"
                                />
                                <CustomInput
                                    className="w-full outline-none border-0 border-none bg-transparent"
                                    type="text" placeholder="Enter branch name"
                                    {...register("bankDetails.branchName")}
                                />
                            </div>
                            {errors?.bankDetails?.branchName && (
                                <p className="text-xs text-red-500">
                                    {errors.bankDetails.branchName.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">
                                PAN Card Number
                            </label>
                            <div className="flex items-center gap-2 border border-gray-400 rounded-full px-2 p-1">
                                <img
                                    src="/admin-img/userte.png"
                                    alt="user"
                                    className="input-img-side"
                                />
                                <CustomInput
                                    className="w-full outline-none border-0 border-none bg-transparent"
                                    type="text" placeholder="Enter pancard number"
                                    {...register("bankDetails.panCardNumber")}
                                />
                            </div>
                            {errors?.bankDetails?.panCardNumber && (
                                <p className="text-xs text-red-500">
                                    {errors.bankDetails.panCardNumber.message}
                                </p>
                            )}
                        </div>

                        <div className="mt-3 flex gap-6 col-span-3">
                            <div className="flex-shrink-0 bg-[#2f1254] rounded-2xl items-center justify-start flex p-1 ">
                                <img
                                    src="/admin-img/userte.png"
                                    alt="Preview"
                                    className=" object-contain rounded-md  input-img-side"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <div className="flex flex-wrap gap-4 items-center justify-start">
                                    {[
                                        { label: "Profile Image", name: "profile" },
                                        { label: "Aadhar Image", name: "aadhar" },
                                        { label: "PanCard Image", name: "pan" },
                                        { label: "Passbook Image", name: "passbook" },
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-3">
                                            <label className="w-[10rem] text-sm font-medium text-gray-600">
                                                {item.label} :
                                            </label>

                                            <Controller
                                                name={`bankDetails.documents.${item.name}`}
                                                control={control}
                                                render={({ field }) => (
                                                    <input
                                                        type="file"
                                                        accept=".jpg,.jpeg,.png,.pdf"
                                                        className="block w-full text-sm text-gray-600 file:mr-4 file:py-1 file:px-3 
                                                                        file:rounded-full file:border-0 
                                                                        file:text-sm file:font-medium 
                                                                        file:bg-purple-50 file:text-purple-700 
                                                                        hover:file:bg-purple-100"
                                                        onChange={(e) => field.onChange(e.target.files?.[0])}
                                                    />
                                                )}
                                            />
                                        </div>
                                    ))}
                                    {/* {errors?.bankDetails?.documents?.profile && (
                                        <p className="text-xs text-red-500">
                                            {errors.bankDetails.documents.profile.message}
                                        </p>
                                    )}
                                    {errors?.bankDetails?.documents?.aadhar && (
                                        <p className="text-xs text-red-500">
                                            {errors.bankDetails.documents.aadhar.message}
                                        </p>
                                    )}
                                    {errors?.bankDetails?.documents?.pan && (
                                        <p className="text-xs text-red-500">
                                            {errors.bankDetails.documents.pan.message}
                                        </p>
                                    )}
                                    {errors?.bankDetails?.documents?.passbook && (
                                        <p className="text-xs text-red-500">
                                            {errors.bankDetails.documents.passbook.message}
                                        </p>
                                    )} */}
                                </div>
                                <span className="text-xs text-red-400 mt-2">
                                    ***Note: Maximum upload limit <b>1 MB</b>.
                                </span>
                            </div>
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

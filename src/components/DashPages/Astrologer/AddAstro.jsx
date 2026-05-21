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
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { mapAstrologerPayload } from "@/components/utils/mappers/astrologer.mappers";
import toast from "react-hot-toast";
import CustomToggle from "@/components/Custom/CustomToggle";

const ADD_ASTROLOGER = gql`
  mutation AddAstrologer($data: AddAstrologerInput!) {
    addAstrologer(data: $data) {
      success
      message
      data {
        id
        name
        email
      }
    }
  }
`;

export default function AddAstro() {
  const [activeTab, setActiveTab] = useState("call");

  const [addAstrologer, { loading, error }] = useMutation(ADD_ASTROLOGER);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addAstrologerSchema),
    defaultValues: {
      gender: "MALE",
      tzone: "In",
      tags: "New",
      vtags: "not verified",
      expertise: [],
      languages: [],
      problems: [],
      about: "",

      countryStateCity: {
        country: "",
        state: "",
        city: "",
      },

      pricing: [
        {
          type: "CHAT",
          price: "",
          offerPrice: "",
          commissionPercent: "",
          isActive: true,
        },
        {
          type: "CALL",
          price: "",
          offerPrice: "",
          commissionPercent: "",
          isActive: true,
        },
        {
          type: "VIDEO",
          price: "",
          offerPrice: "",
          commissionPercent: "",
          isActive: true,
        },
        {
          type: "AUDIO",
          price: "",
          offerPrice: "",
          commissionPercent: "",
          isActive: true,
        },
      ],
      bankDetails: {
        accountHolderName: "",
        accountNumber: "",
        bankName: "",
        ifscCode: "",
        panCardNumber: "",
        branchName: "",
      },
      documents: {
        profilePic: null,
        aadhaar: null,
        panCard: null,
        passbook: null,
      },
    },
  });

  const pincode = watch("pincode");

  useEffect(() => {
    if (!pincode || pincode.toString().length !== 6) return;

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://api.postalpincode.in/pincode/${pincode}`,
        );

        const data = await res.json();

        if (data[0].Status === "Success") {
          const location = data[0].PostOffice[0];

          setValue("countryStateCity.country", "India");
          setValue("countryStateCity.state", location.State);
          setValue("countryStateCity.city", location.District);
        } else {
          setValue("countryStateCity.country", "");
          setValue("countryStateCity.state", "");
          setValue("countryStateCity.city", "");
        }
      } catch (error) {
        console.log("Pincode fetch error:", error);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [pincode, setValue]);

  const onSubmit = async (formData) => {
    try {
      const fd = new FormData();

      Object.entries(formData.documents).forEach(([key, file]) => {
        if (file) fd.append(key, file);
      });

      const uploadRes = await fetch(
        "https://dhwaniastro.com/adminAuth/api/upload-documents",
        {
          method: "POST",
          body: fd,
        },
      );

      const uploadedFiles = await uploadRes.json();

      const payload = mapAstrologerPayload({
        ...formData,
        documents: uploadedFiles,
      });

      const res = await addAstrologer({ variables: { data: payload } });

      toast.success(res.data.addAstrologer.message);
      reset();
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong ❌");
    }
  };

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
      options: ["English", "Hindi", "Punjabi", "Malayalam"],
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

  const SERVICE_INDEX = {
    CHAT: 0,
    CALL: 1,
    VIDEO: 2,
    AUDIO: 3,
  };

  const Toggle = ({ value, onChange }) => (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`w-8 h-4 flex items-center rounded-full p-1 ${
        value ? "bg-green-500" : "bg-gray-300"
      }`}
    >
      <div
        className={`bg-white w-3 h-3 rounded-full shadow transform ${
          value ? "translate-x-4" : ""
        }`}
      />
    </button>
  );

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
        className="bg-white shadow-lg rounded-2xl p-5 space-y-6"
      >
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
              <CustomInput
                className="w-full outline-none border-0 border-none bg-transparent"
                {...register("astroname")}
                placeholder="Enter full name"
              />
            </div>
            {errors.astroname && (
              <p className="text-red-500 text-xs">{errors.astroname.message}</p>
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

              <CustomInput
                className="w-full outline-none border-0 border-none bg-transparent"
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
              Email Address
            </label>
            <div className="flex items-center gap-2 border border-gray-400 rounded-full px-2 p-1">
              <img
                src="/admin-img/userte.png"
                alt="user"
                className="input-img-side"
              />

              <CustomInput
                className="w-full outline-none border-0 border-none bg-transparent"
                {...register("email")}
                placeholder="Enter email"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email.message}</p>
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
                  { value: "MALE", label: "Male" },
                  { value: "FEMALE", label: "Female" },
                  { value: "OTHER", label: "Other" },
                ]}
              />
            )}
          />
          {errors.gender && (
            <p className="text-red-500 text-xs">{errors.gender.message}</p>
          )}

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
              <CustomInput
                className="w-full outline-none border-0 border-none bg-transparent"
                type="number"
                placeholder="Enter phone number"
                {...register("phoneNumber", { valueAsNumber: true })}
              />
            </div>
            {errors.phoneNumber && (
              <p className="text-red-500 text-xs">
                {errors.phoneNumber.message}
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
                type="number"
                placeholder="Enter experience in years"
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
              <CustomInput
                className="w-full outline-none border-0 border-none bg-transparent"
                {...register("address")}
                placeholder="Enter address"
              />
            </div>
            {errors.address && (
              <p className="text-red-500 text-xs"> {errors.address.message}</p>
            )}
          </div>

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
                type="number"
                placeholder="Enter pincode"
                {...register("pincode", { valueAsNumber: true })}
              />
            </div>
            {errors.pincode && (
              <p className="text-red-500 text-xs">{errors.pincode.message}</p>
            )}
          </div>

          <div className="col-span-3 grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Country
              </label>

              <CustomInput
                className="w-full outline-none  bg-transparent"
                {...register("countryStateCity.country")}
                placeholder="Auto fetched country"
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                State
              </label>

              <CustomInput
                className="w-full outline-none  bg-transparent"
                {...register("countryStateCity.state")}
                placeholder="Auto fetched state"
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                City
              </label>

              <CustomInput
                className="w-full outline-none  bg-transparent"
                {...register("countryStateCity.city")}
                placeholder="Auto fetched city"
                readOnly
              />
            </div>
          </div>

          {/* <div>
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
                    </div> */}

          <Controller
            name="tzone"
            control={control}
            render={({ field }) => (
              <CustomDropdown
                {...field}
                label="TimeZone"
                options={[
                  { value: "In", label: "India (UTC+5:30)" },
                  { value: "Us", label: "US (UTC-5:00)" },
                ]}
              />
            )}
          />
        </div>

        <h2 className=" mb-2 text-base font-semibold text-purple-500">
          About Astrologer :
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-500 mb-1">
              About Me (in English)
            </label>
            <div className="flex items-center gap-2 border border-gray-400 rounded-2xl px-2 p-1">
              <Controller
                name="about"
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
            {errors.about && (
              <p className="text-red-500 text-xs">
                {errors.about.message}
              </p>
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
            <div className="p-4 rounded-xl flex flex-col gap-2 border border-gray-200 bg-white w-full">
              <h2 className="font-semibold text-sm text-center">
                Astrologer Charges
              </h2>

              <div className="grid grid-cols-2 gap-5">
                {" "}
                {["CHAT", "CALL", "VIDEO", "AUDIO"].map((type, index) => (
                  <div
                    key={type}
                    className="border border-gray-200 p-2 rounded-lg "
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="block text-sm font-medium text-gray-500 mb-1">
                        {type}
                      </h3>

                      <Controller
                        control={control}
                        name={`pricing.${index}.isActive`}
                        render={({ field }) => (
                          <Toggle
                            value={field.value}
                            onChange={field.onChange}
                          />
                        )}
                      />
                    </div>

                    {watch(`pricing.${index}.isActive`) && (
                      <div className="flex justify-evenly  gap-2">
                        <input
                          {...register(`pricing.${index}.price`)}
                          placeholder="Price"
                          className="border border-gray-100 rounded-full p-1 text-sm w-1/3 "
                        />

                        <input
                          {...register(`pricing.${index}.offerPrice`)}
                          placeholder="Offer"
                          className="border border-gray-100 rounded-full p-1 text-sm w-1/3  "
                        />

                        <input
                          {...register(`pricing.${index}.commissionPercent`)}
                          placeholder="%"
                          className="border border-gray-100 rounded-full p-1 text-sm w-1/3  "
                        />
                      </div>
                    )}
                  </div>
                ))}
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
                label="Tag"
                options={[
                  { value: "New", label: "New" },
                  { value: "Rising Star", label: "Rising Star" },
                  { value: "Celebrity", label: "Celebrity" },
                  { value: "Top Ranking", label: "Top Ranking" },
                  { value: "Top Choice", label: "Top Choice" },
                ]}
              />
            )}
          />

          {errors.tags && (
            <p className="text-red-500 text-xs">{errors.tags.message}</p>
          )}
          <Controller
            name="vtags"
            control={control}
            render={({ field }) => (
              <CustomDropdown
                {...field}
                label="Verification"
                options={[
                  { value: "verified", label: "Verified" },
                  { value: "not verified", label: "Not Verified" },
                ]}
              />
            )}
          />
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
                  type="text"
                  placeholder="Enter bank name"
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
                  type="text"
                  placeholder="Enter IFSC code"
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
                  type="text"
                  placeholder="Enter branch name"
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
                  type="text"
                  placeholder="Enter pancard number"
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
                    { label: "Profile Image", name: "profilePic" },
                    { label: "Aadhar Image", name: "aadhaar" },
                    { label: "PanCard Image", name: "panCard" },
                    { label: "Passbook Image", name: "passbook" },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <label className="w-[10rem] text-sm font-medium text-gray-600">
                        {item.label} :
                      </label>

                      <Controller
                        name={`documents.${item.name}`}
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
                            onChange={(e) =>
                              field.onChange(e.target.files?.[0])
                            }
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
          <CustomButton
            type="submit"
            variant="green"
            className="px-4 py-1"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Astrologer"}
          </CustomButton>

          <CustomButton
            type="button"
            variant="gray"
            className="px-4 py-1"
            onClick={() => reset()}
          >
            Reset
          </CustomButton>
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center">{error.message}</p>
        )}
      </form>
    </div>
  );
}

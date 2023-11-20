"use client";

import Image from "next/image";

import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Session } from "@supabase/supabase-js";
import classNames from "classnames";

import FormLine from "@/components/FormLine";
import FormTextArea from "@/components/FormTextArea";
import { INITIAL_USER_DATA, UserInterface } from "@/app/types/user";
import { INITIAL_ORG_DATA, OrgInterface } from "@/app/types/organization";
import { supabaseStorageUrl } from "@/utils/constants";
import { createClient } from "@/utils/supabase/client";
import { FaCircleInfo, FaAt, FaCheck } from "react-icons/fa6";

interface ProfileFormData {
  name: string;
  username: string;
  bio: string;
  orgName: string;
  orgDescription?: string;
  orgHandle?: string;
  orgMeta?: string;
}

interface SettingsInterface {
  session?: Session | null;
}

const ProfileForm = ({ session }: SettingsInterface) => {
  const {
    handleSubmit,
    control,
    register,
    reset,
    getValues,
    formState: { errors },
  } = useForm<ProfileFormData>({});

  const authUser = session?.user;

  const profileImageInputRef = useRef<HTMLInputElement | null>(null);
  const [profileImageSrc, setProfileImageSrc] = useState<string>("");
  const [profileImageFile, setProfileImageFile] = useState<File>();
  const orgImageInputRef = useRef<HTMLInputElement | null>(null);
  const [orgImageSrc, setOrgImageSrc] = useState<string>("");
  const [orgImageFile, setOrgImageFile] = useState<File>();
  const [userData, setUserData] = useState<UserInterface>(INITIAL_USER_DATA);
  const [orgData, setOrgData] = useState<OrgInterface>(INITIAL_ORG_DATA);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const supabase = createClient();

  const getUserData = useCallback(async () => {
    const { data: user } = await supabase
      .from("users")
      .select("*")
      .match({
        id: authUser?.id,
      })
      .single();
    if (user) setUserData(user);
  }, []);

  useEffect(() => {
    getUserData();
  }, []);

  const getOrgData = useCallback(async () => {
    const { data: org } = await supabase
      .from("organizations")
      .select("*")
      .match({
        creator: authUser?.id,
      })
      .limit(1)
      .single();
    if (org) setOrgData(org);
  }, []);

  useEffect(() => {
    getOrgData();
  }, []);

  useEffect(() => {
    reset({
      name: userData?.name,
      username: userData?.username,
      bio: userData?.bio,
    });
  }, [userData, reset]);

  useEffect(() => {
    reset({
      orgName: orgData.name,
      orgDescription: orgData.description,
      orgHandle: orgData.handle,
      orgMeta: orgData.meta,
    });
  }, [orgData, reset]);

  useEffect(() => {
    if (userData && userData.avatar_url) {
      setProfileImageSrc(`${supabaseStorageUrl}/${userData?.avatar_url}` || "");
    }
  }, [userData]);

  useEffect(() => {
    if (orgData && orgData.logo_url) {
      setOrgImageSrc(`${supabaseStorageUrl}/${orgData?.logo_url}` || "");
    }
  }, [userData]);

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const imgFile = e.target.files?.[0];
    if (imgFile) {
      setProfileImageFile(imgFile);
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImageSrc(reader.result as string);
      };
      reader.readAsDataURL(imgFile);
    }
  };

  const handleOrgImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const imgFile = e.target.files?.[0];
    if (imgFile) {
      setOrgImageFile(imgFile);
      const reader = new FileReader();
      reader.onload = () => {
        setOrgImageSrc(reader.result as string);
      };
      reader.readAsDataURL(imgFile);
    }
  };

  const onSubmit = useCallback(
    async (data: ProfileFormData) => {
      try {
        setIsSaving(true);
        const {
          name,
          username,
          bio,
          orgName,
          orgDescription,
          orgHandle,
          orgMeta,
        } = data;
        let avatarUrl;
        if (profileImageFile && userData.avatar_url !== profileImageSrc) {
          const fileExt = profileImageFile.name.split(".").pop();
          avatarUrl = `avatars/${userData.id}_${Math.random()}.${fileExt}`;
          const { error: uploadError } = await supabase.storage
            .from("assets")
            .upload(avatarUrl, profileImageFile);
          if (uploadError) {
            throw uploadError;
          }
        }

        let orgLogoUrl;
        if (orgImageFile && orgData.logo_url !== orgImageSrc) {
          const fileExt = orgImageFile.name.split(".").pop();
          orgLogoUrl = `org_logos/${userData.id}_${Math.random()}.${fileExt}`;
          const { error: uploadError } = await supabase.storage
            .from("assets")
            .upload(orgLogoUrl, orgImageFile);
          if (uploadError) {
            throw uploadError;
          }
        }

        const updateUserObj = {
          id: userData.id,
          name,
          username,
          bio,
        };
        if (avatarUrl) {
          Object.assign(updateUserObj, { avatar_url: avatarUrl });
        }
        const { error: userUpdateError } = await supabase
          .from("users")
          .upsert(updateUserObj);
        if (userUpdateError) throw userUpdateError;

        const updateOrgObj = {
          name: orgName,
          description: orgDescription,
          handle: orgHandle,
          meta: orgMeta,
        };
        if (orgLogoUrl) {
          Object.assign(updateOrgObj, { logo_url: orgLogoUrl });
        }

        const insertObj = Object.assign(updateOrgObj, { creator: userData.id });

        if (orgData.id) {
          const { error: orgUpdateError } = await supabase
            .from("organizations")
            .update(updateOrgObj)
            .eq("id", orgData.id);
          if (orgUpdateError) throw orgUpdateError;
        } else {
          const { error: orgInsertError } = await supabase
            .from("organizations")
            .insert(insertObj);
          if (orgInsertError) throw orgInsertError;
        }

        setIsSaving(false);
        getOrgData();
      } catch (error) {
        setIsSaving(false);
      }
    },
    [
      profileImageFile,
      profileImageSrc,
      orgData,
      orgImageFile,
      orgImageSrc,
      userData,
    ]
  );

  return (
    <>
      <section className="max-w-3xl mx-auto">
        {/* heading */}
        <div className="pb-8">
          <h1 className="font-bold">User Profile</h1>
          <p className="text-gray-400 mt-2">
            View and update your account details, profile, and more.
          </p>
        </div>

        {/* Basic Info */}
        <div className="bg-white rounded-lg shadow pt-6 pb-3 mb-6">
          <div className="grid grid-col-1 md:grid-cols-3 px-8 pb-4">
            <div className="md:col-span-2 mr-5">
              <div className="mb-3 items-center py-4">
                <div className="px-3 pb-1.5 pt-2.5 focus-within:ring-2 focus-within:ring-purple-200 shadow-inner border border-gray-200 bg-white rounded text-gray-600 outline-none focus:ring-2">
                  <label
                    htmlFor="name"
                    className="block text-xs font-medium text-gray-500 pb-1"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="block w-full p-0 text-gray-400 placeholder:text-gray-400 border-0 focus:ring-0 outline-none sm:text-sm sm:leading-6"
                    placeholder="Ex. John Doe"
                    defaultValue=""
                  />
                </div>
              </div>

              <hr className="bg-gray-200 block h-[1px] my-2 px-8 mb-4" />

              <div className="mb-3 items-center py-4">
                <div className="relative px-3 pb-1.5 pt-2.5 focus-within:ring-2 focus-within:ring-purple-200 shadow-inner border border-gray-200 bg-white rounded text-gray-600 outline-none focus:ring-2">
                  <label
                    htmlFor="name"
                    className="block text-xs font-medium text-gray-500 pb-1"
                  >
                    Username
                    <span className="inline-flex items-center justify-center h-4 w-4 ml-1 text-gray-400">
                      <FaCircleInfo />
                    </span>
                  </label>
                  <input
                    type="text"
                    name="handle"
                    className="block w-full border-0 py-0 px-5 text-gray-400 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 outline-none"
                    placeholder="Enter Username"
                    defaultValue=""
                  />
                  <span className="inline-flex text-gray-500 items-center justify-center h-[2.25em] w-[2.25em] absolute left-0 bottom-0">
                    <FaAt />
                  </span>
                  <div className="inline-flex items-center justify-center h-[2.5em] w-[2.5em] absolute right-0 bottom-0">
                    <FaCheck className="text-green-500" />
                    {/* TODO add the commented out logic below: */}
                    {/* {formStatus ? <FaCheck className="text-green-500"/> : <FaBan className="text-red-500"/>} */}
                  </div>
                </div>
              </div>

              <hr className="bg-gray-200 block h-[1px] my-2 px-8 mb-4" />

              <div className="mb-3 items-center py-4">
                <div className="px-3 pb-1.5 pt-2.5 focus-within:ring-2 focus-within:ring-purple-200 shadow-inner border border-gray-200 bg-white rounded text-gray-600 outline-none focus:ring-2">
                  <label
                    htmlFor="name"
                    className="block text-xs font-medium text-gray-500 pb-1"
                  >
                    Bio
                    <span className="inline-flex items-center justify-center h-4 w-4 ml-1 text-gray-400">
                      <FaCircleInfo />
                    </span>
                  </label>
                  <textarea
                    name="bio"
                    className="block w-full border-0 p-0 text-gray-600 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 outline-none"
                    placeholder="Enter Bio Here"
                    defaultValue=""
                  />
                </div>
              </div>
            </div>
            <div className="md:col-span-1 py-5 flex flex-col  items-center">
              {/* <ImageUpload organization={accountData} /> */}
              <div className="w-full flex flex-col items-center">
                <span className="block text-secondary mb-2">
                  Profile Image
                  <span className="text-[0.65rem] font-regular text-gray-400 mx-4">
                    320px x 320px
                  </span>
                </span>
                <div
                  className="w-40 h-40 bg-gray-200 rounded-full my-4 cursor-pointer"
                  onClick={() => profileImageInputRef?.current?.click()}
                >
                  {profileImageSrc && (
                    <Image
                      src={profileImageSrc}
                      alt="Profile"
                      width={150}
                      height={150}
                      className="w-40 h-40 rounded-full"
                    />
                  )}
                </div>
                {/* Profile Image input */}
                <input
                  title="image"
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  className="hidden"
                  ref={profileImageInputRef}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button className="mt-3 inline-flex items-center justify-center px-4 py-2 font-medium text-center text-md bg-purple-900 text-white rounded-md hover:bg-[#5616de] hover:text-white focus:ring-4 focus:ring-purple-300">
            Update
          </button>
        </div>
      </section>
    </>
  );
};

export default ProfileForm;

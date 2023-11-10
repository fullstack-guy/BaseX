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
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="pb-5">
          <h3 className="block text-black font-bold mb-2 text-3xl">
            Profile Data
          </h3>
          <section className="flex flex-col md:flex-row justify-between mb-4">
            <div className="w-full md:w-[50%]">
              <span className="block text-secondary font-semibold mb-2">
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
          </section>
          <section className="mb-4">
            <FormLine
              id="displayName"
              {...register("name")}
              title="Name"
              placeholder="Ex. John Doe"
              error={errors.name?.message}
            />
          </section>
          <section className="mb-4">
            <FormLine
              id="username"
              {...register("username")}
              title="Username"
              placeholder="Enter username"
              error={errors.username?.message}
            />
          </section>
          <section className="mb-4">
            <FormTextArea
              maxLength={250}
              id="bio"
              {...register("bio")}
              defaultValue={getValues("bio")}
              title="Bio"
              placeholder="Enter description of yourself"
              error={errors.bio?.message}
              rows={5}
            />
          </section>
        </div>
        <hr className="h-2" />
        <div className="pb-5">
          <h3 className="block text-black font-bold mb-2 text-3xl">
            Organization Data
          </h3>
          <p className=" text-lg text-black">
            {orgData.id
              ? "You can update your organization data here"
              : "Please create a new organization here"}
          </p>
          <section className="mb-4">
            <FormLine
              id="orgName"
              {...register("orgName")}
              title="Organization Name"
              placeholder="Group A"
              error={errors.orgName?.message}
              required
            />
          </section>
          <section className="mb-4">
            <FormTextArea
              maxLength={250}
              id="orgDescription"
              {...register("orgDescription")}
              defaultValue={getValues("orgDescription")}
              title="Description"
              placeholder="Enter description of organization"
              error={errors.orgDescription?.message}
              rows={5}
            />
          </section>
          <section className="mb-4">
            <FormLine
              id="orgHandle"
              {...register("orgHandle")}
              title="Handle"
              placeholder="Enter handle here"
              error={errors.orgHandle?.message}
            />
          </section>
          <section className="flex flex-col md:flex-row justify-between mb-4">
            <div className="w-full md:w-[50%]">
              <span className="block text-secondary font-semibold mb-2">
                Organization Image
                <span className="text-[0.65rem] font-regular text-gray-400 mx-4">
                  320px x 320px
                </span>
              </span>
              <div
                className="w-40 h-40 bg-gray-200 rounded-full my-4 cursor-pointer"
                onClick={() => orgImageInputRef?.current?.click()}
              >
                {orgImageSrc && (
                  <Image
                    src={orgImageSrc}
                    alt="Organization"
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
                onChange={handleOrgImageChange}
                className="hidden"
                ref={orgImageInputRef}
              />
            </div>
          </section>

          <section className="mb-4">
            <FormTextArea
              maxLength={250}
              id="orgMeta"
              {...register("orgMeta")}
              defaultValue={getValues("orgMeta")}
              title="Meta Data"
              placeholder="Enter metadata here"
              error={errors.orgMeta?.message}
              rows={5}
            />
          </section>
        </div>
        <div className="flex justify-start">
          <button
            type="submit"
            disabled={isSaving}
            className={classNames(
              "py-2 px-5 rounded-full  text-white hover:shadow-md",
              {
                "bg-sky-700": !isSaving,
                "bg-gray-700 cursor-not-allowed": isSaving,
              }
            )}
          >
            {isSaving ? "Saving" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;

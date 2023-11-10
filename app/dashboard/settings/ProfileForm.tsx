"use client";

import Image from "next/image";

import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import FormLine from "@/components/FormLine";
import FormTextArea from "@/components/FormTextArea";
import { INITIAL_USER_DATA, UserInterface } from "@/app/types/user";
import { Session } from "@supabase/supabase-js";
import { supabaseStorageUrl } from "@/utils/constants";
import classNames from "classnames";

interface ProfileFormData {
  name: string;
  username: string;
  bio: string;
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
  const [userData, setUserData] = useState<UserInterface>(INITIAL_USER_DATA);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const supabase = createClientComponentClient();

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

  useEffect(() => {
    reset({
      name: userData?.name,
      username: userData?.username,
      bio: userData?.bio,
    });
  }, [userData, reset]);

  useEffect(() => {
    if (userData) {
      setProfileImageSrc(`${supabaseStorageUrl}/${userData?.avatar_url}` || "");
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

  const onSubmit = useCallback(
    async (data: ProfileFormData) => {
      try {
        setIsSaving(true);
        const { name, username, bio } = data;
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

        const updateObj = {
          id: userData.id,
          name,
          username,
          bio,
        };
        if (avatarUrl) {
          Object.assign(updateObj, { avatar_url: avatarUrl });
        }
        const { error } = await supabase.from("users").upsert(updateObj);
        if (error) throw error;
        setIsSaving(false);
      } catch (error) {
        setIsSaving(false);
      }
    },
    [profileImageFile, profileImageSrc]
  );

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)}>
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

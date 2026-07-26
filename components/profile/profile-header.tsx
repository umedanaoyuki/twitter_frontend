import Image from "next/image";
import { IoCalendarClearOutline, IoLocationOutline } from "react-icons/io5";

import { EditProfileDialog } from "@/components/profile/edit-profile-dialog";
import type { ProfileView } from "@/lib/types/profile";

type ProfileHeaderProps = {
  profile: ProfileView;
};

function ProfileHeader({ profile }: ProfileHeaderProps) {
  const { name, handle, bio, location, imageUrl, joinedText } = profile;

  return (
    <section aria-label="プロフィール情報">
      {/* バナー */}
      <div className="h-[150px] w-full bg-[#333639] sm:h-[200px]" aria-hidden />

      <div className="px-4 pb-3">
        <div className="flex items-start justify-between">
          {/* アバター（バナーに重ねる） */}
          <div className="mt-[-15%] max-w-[25%] min-w-[48px]">
            <div className="aspect-square w-full overflow-hidden rounded-full border-4 border-black bg-[#333639]">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={`${name}のアバター`}
                  width={134}
                  height={134}
                  unoptimized
                  className="size-full object-cover"
                />
              ) : null}
            </div>
          </div>

          <div className="mt-3">
            <EditProfileDialog
              exists={profile.exists}
              initialValues={profile.form}
            />
          </div>
        </div>

        <div className="mt-2">
          <h2 className="text-xl leading-6 font-extrabold text-[#e7e9ea]">
            {name}
          </h2>
          <p className="text-[15px] text-[#71767b]">@{handle}</p>
        </div>

        {bio ? (
          <p className="mt-3 text-[15px] whitespace-pre-wrap text-[#e7e9ea]">
            {bio}
          </p>
        ) : null}

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[15px] text-[#71767b]">
          {location ? (
            <span className="flex items-center gap-1">
              <IoLocationOutline className="size-[18px]" />
              {location}
            </span>
          ) : null}
          {joinedText ? (
            <span className="flex items-center gap-1">
              <IoCalendarClearOutline className="size-[18px]" />
              {joinedText}
            </span>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export { ProfileHeader };

import Image from 'next/image';
import React from 'react';

// Define the props interface for type safety
interface ProfileTabProps {
  imgSrc: string;
}

const ProfileTab = ({ imgSrc }: ProfileTabProps) => {
  return (
    <div className="rounded-md p-4 border">
      <div className="h-24 w-24 rounded-full relative">
        <Image
          src={imgSrc.replace('=s96-c', '=s256-c')}
          alt="Profile Photo"
          fill
          className="object-cover rounded-full"
          priority
        />
      </div>
    </div>
  );
};

export default ProfileTab;
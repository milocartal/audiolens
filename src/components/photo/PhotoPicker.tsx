import { Camera, Grid2X2 } from "lucide-react";
import Image from "next/image";
import React, { Fragment, useRef } from "react";

interface PhotoPickerProps {
  image: string;
  setImage: React.Dispatch<React.SetStateAction<string>>;
  setFile: React.Dispatch<React.SetStateAction<File | undefined>>;
}

export const PhotoPicker: React.FC<PhotoPickerProps> = ({
  image,
  setImage,
  setFile,
}) => {
  const CameraRef = useRef<HTMLInputElement>(null);
  const GalleryRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      setFile(file);
      reader.onload = (e) => {
        setImage(e.target!.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Fragment>
      <input
        ref={CameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        hidden
        onChange={handleImageChange}
      />
      <input
        ref={GalleryRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleImageChange}
      />
      <div className="relative flex h-full w-full items-center justify-center gap-2 overflow-y-auto rounded-md">
        <div className="h-full w-full">
          <Image
            loader={({ src }) => src}
            src={image}
            alt="placeholder"
            width={300}
            height={300}
            className="h-full w-full object-cover"
          />
        </div>
        <button
          onClick={() => CameraRef.current?.click()}
          className="absolute bottom-4 rounded-full bg-white p-4 text-black shadow-md "
        >
          <Camera className="h-8 w-8" />
        </button>
      </div>
      <button
        onClick={() => GalleryRef.current?.click()}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-white py-2 text-xs text-black"
      >
        <Grid2X2 className="h-6 w-6" />
        Prendre une photo de la gallerie
      </button>
    </Fragment>
  );
};


/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { useDropzone } from "react-dropzone";
import { Dialog, DialogPanel } from "@headlessui/react"; // For popup modal
import { uploadSingleImage } from "@/util/s3Helpers";
import { getCroppedImg } from "@/util/ImageFuns";
import { IconType } from "react-icons/lib";
import { toast } from "sonner";
import { EAspectRatio } from "@/common/enums";
interface ImageUploaderProps {
    onUploadComplete: (url: string) => void;
    aspect?: EAspectRatio
    name?: string
    Icon?:IconType
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onUploadComplete, aspect=EAspectRatio.STANDARD, name, Icon }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [uploading, setUploading] = useState(false);

    // Handle file drop
    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setImageSrc(reader.result as string);
            reader.readAsDataURL(file);
        }
    }, []);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: { "image/*": [] },
        multiple: false,
    });

    const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    // Upload cropped image to S3
    const handleUpload = async () => {
        try {
            setUploading(true)
            if (!imageSrc || !croppedAreaPixels) return;

            const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
            if (!croppedImage) return;

            const response = await fetch(croppedImage);
            const blob = await response.blob();
            const file = new File([blob], "cropped-image.jpg", { type: "image/jpeg" });

            const uploadedUrl = await uploadSingleImage(file);
            if (uploadedUrl) {
                toast.success("Image Uploaded Successfully")
                onUploadComplete(uploadedUrl);
                setIsOpen(false);
                setImageSrc(null);
            }else {
                toast.error("Failed to upload the image");
            }
        } catch (error) {
            console.log('error', error)
            toast.error("Error uploading image");
        }finally{
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <button
                onClick={() => setIsOpen(true)}
                type="button"
                className="px-4 py-[5px] text-[0.9rem] bg-blue-600 text-white rounded-md flex items-center justify-center gap-[5px]"
            >
                {Icon ? <i className="text-[18px]"><Icon /></i> :null}
                {name || "Upload Image"}
            </button>

            {/* Popup Modal */}
            <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
                <div className="w-full fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
                    <DialogPanel className="bg-white p-6 w-full rounded-lg shadow-lg lg:w-[80%] max-w-[90%]">
                        <h2 className="text-lg text-gray-800 font-semibold mb-4">Select Image</h2>

                        {/* File Drop Zone */}
                        {!imageSrc ? (
                            <div
                                {...getRootProps()}
                                className="border-2 border-dashed border-gray-300 p-6 text-center cursor-pointer"
                            >
                                <input {...getInputProps()} />
                                <p className="text-gray-600">Drag & drop an image here, or click to select</p>
                            </div>
                        ) : (
                            <>
                                {/* Image Cropper */}
                                <div className="relative w-full h-64 bg-gray-600">
                                    <Cropper
                                        image={imageSrc}
                                        crop={crop}
                                        zoom={zoom}
                                        aspect={aspect}
                                        onCropChange={setCrop}
                                        onZoomChange={setZoom}
                                        onCropComplete={onCropComplete}
                                    />
                                </div>

                                {/* Crop Controls */}
                                <div className="flex justify-between mt-4">
                                    <button
                                        type="button"
                                        className="px-4 py-2 bg-red-500 text-white rounded-md"
                                        onClick={() =>{ 
                                            setImageSrc(null)
                                            setIsOpen(false)}}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        disabled={uploading}
                                        className="px-4 py-2 bg-green-500 text-white rounded-md disabled:bg-gray-600 hover:bg-green-800"
                                        onClick={handleUpload}
                                    >
                                        {uploading ? "saving image...": "Upload"}
                                    </button>
                                </div>
                            </>
                        )}
                    </DialogPanel>
                </div>
            </Dialog>
        </div>
    );
};

export default ImageUploader;

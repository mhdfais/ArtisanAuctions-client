import React, { useState, useCallback, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "@/utils/cropImage";
import { Button } from "../ui/button";
import { Area } from "react-easy-crop";
import useToast from "@/hooks/useToast";
import { addArtwork } from "@/services/userService";

interface ArtworkFormProps {
  cancel: () => void;
  fetchArtworks:()=>any
}
export enum ArtCategory {
  PAINTING = "Painting",
  SCULPTURE = "Sculpture",
  PHOTOGRAPHY = "Photography",
  OTHER = "Other",
}

export enum Medium {
  OIL = "Oil",
  ACRYLIC = "Acrylic",
  WATERCOLOR = "Watercolor",
  INK = "Ink",
  CHARCOAL = "Charcoal",
  MIXED = "Mixed",
  OTHER = "Other",
}

const ArtworkForm = ({ cancel,fetchArtworks }: ArtworkFormProps) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [croppedImages, setCroppedImages] = useState<File[]>([]);
  const [cropping, setCropping] = useState(false);

  const { error, success } = useToast();

  const validationSchema = Yup.object({
    title: Yup.string().min(3).required("Title is required"),
    yearCreated: Yup.number()
      .min(1000, "Year must be valid")
      .max(new Date().getFullYear(), "Year cannot be in the future")
      .required("Year is required"),
    height: Yup.number()
      .positive("Height must be positive")
      .required("Height is required"),
    width: Yup.number()
      .positive("Width must be positive")
      .required("Width is required"),
    category: Yup.mixed()
      .oneOf(Object.values(ArtCategory))
      .required("Category is required"),
    medium: Yup.mixed()
      .oneOf(Object.values(Medium))
      .required("Medium is required"),
    description: Yup.string().min(30).required("Description is required"),
    reservePrice: Yup.number().min(0).nullable(),
    images: Yup.array().min(1, "At least one image is required"),
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      yearCreated: "",
      height: "",
      width: "",
      category: "",
      medium: "",
      description: "",
      reservePrice: "",
      images: [],
    },
    validationSchema,
    onSubmit: async (values) => {
      console.log("Submitting:", values);
      try {
        const formData = new FormData();

        formData.append("title", values.title);
        formData.append("yearCreated", values.yearCreated.toString());
        formData.append("height", values.height.toString());
        formData.append("width", values.width.toString());
        formData.append("category", values.category);
        formData.append("medium", values.medium);
        formData.append("description", values.description);
        formData.append("reservePrice", values.reservePrice?.toString() || "0");

        croppedImages.forEach((file, index) => {
          formData.append("images", file);
        });

        const res = await addArtwork(formData);
        if (res.status === 201) {
          setCroppedImages([]);
          formik.resetForm();
          cancel();
          fetchArtworks()
          success("Artwork", "Artwork added successfully");
        }
      } catch (err) {
        error("Error", "Failed to add artwork");
      }
    },
  });

  
  useEffect(() => {        // ---------------- Update Formik images when croppedImages change
    formik.setFieldValue("images", croppedImages);
  }, [croppedImages]);

  
  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {  // ------------------- Cropper onCropComplete
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {   // ---------- Handle image selection (file input)  
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    }
  };

  const handleCropSave = async () => {
    if (!selectedImage || !croppedAreaPixels) return;

    setCropping(true);
    try {
      const croppedFile = await getCroppedImg(selectedImage, croppedAreaPixels);
      setCroppedImages((prev) => [...prev, croppedFile]);
      setSelectedImage(null);
    } catch (error) {
      console.error("Crop error:", error);
    } finally {
      setCropping(false);
    }
  };

  const removeImage = (index: number) => {
    setCroppedImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-[#D6A85F]/30 rounded-xl p-6 mb-8 space-y-6 shadow-lg"
    >
      <h3 className="text-2xl font-serif font-bold text-gray-800 mb-4">
        Add New Artwork
      </h3>

      {/* Artwork Title */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Artwork Title
        </label>
        <input
          name="title"
          type="text"
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          required
          className={`w-full border-2 rounded-lg px-4 py-3 focus:ring-[#D6A85F]/20 bg-white ${
            formik.touched.title && formik.errors.title
              ? "border-red-500 focus:border-red-500"
              : "border-[#D6A85F]/30 focus:border-[#D6A85F]"
          }`}
        />
        {formik.touched.title && formik.errors.title && (
          <p className="text-red-500 text-sm mt-1">{formik.errors.title}</p>
        )}
      </div>

      {/* Price */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Reserve Price (₹)
        </label>
        <input
          name="reservePrice"
          type="number"
          min="0"
          value={formik.values.reservePrice}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={`w-full border-2 rounded-lg px-4 py-3 focus:ring-[#D6A85F]/20 bg-white ${
            formik.touched.reservePrice && formik.errors.reservePrice
              ? "border-red-500 focus:border-red-500"
              : "border-[#D6A85F]/30 focus:border-[#D6A85F]"
          }`}
        />
        {formik.touched.reservePrice && formik.errors.reservePrice && (
          <p className="text-red-500 text-sm mt-1">
            {formik.errors.reservePrice}
          </p>
        )}
      </div>

      {/* Year Created */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Created Year
        </label>
        <input
          name="yearCreated"
          type="number"
          min="1000"
          max={new Date().getFullYear()}
          value={formik.values.yearCreated}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          required
          className={`w-full border-2 rounded-lg px-4 py-3 focus:ring-[#D6A85F]/20 bg-white ${
            formik.touched.yearCreated && formik.errors.yearCreated
              ? "border-red-500 focus:border-red-500"
              : "border-[#D6A85F]/30 focus:border-[#D6A85F]"
          }`}
        />
        {formik.touched.yearCreated && formik.errors.yearCreated && (
          <p className="text-red-500 text-sm mt-1">
            {formik.errors.yearCreated}
          </p>
        )}
      </div>

      {/* Dimensions */}
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Height (cm)
          </label>
          <input
            name="height"
            type="number"
            min="0"
            value={formik.values.height}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
            className={`w-full border-2 rounded-lg px-4 py-3 focus:ring-[#D6A85F]/20 bg-white ${
              formik.touched.height && formik.errors.height
                ? "border-red-500 focus:border-red-500"
                : "border-[#D6A85F]/30 focus:border-[#D6A85F]"
            }`}
          />
          {formik.touched.height && formik.errors.height && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.height}</p>
          )}
        </div>
        <div className="flex-1">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Width (cm)
          </label>
          <input
            name="width"
            type="number"
            min="0"
            value={formik.values.width}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
            className={`w-full border-2 rounded-lg px-4 py-3 focus:ring-[#D6A85F]/20 bg-white ${
              formik.touched.width && formik.errors.width
                ? "border-red-500 focus:border-red-500"
                : "border-[#D6A85F]/30 focus:border-[#D6A85F]"
            }`}
          />
          {formik.touched.width && formik.errors.width && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.width}</p>
          )}
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Category
        </label>
        <select
          name="category"
          value={formik.values.category}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          required
          className={`w-full border-2 rounded-lg px-4 py-3 focus:ring-[#D6A85F]/20 bg-white ${
            formik.touched.category && formik.errors.category
              ? "border-red-500 focus:border-red-500"
              : "border-[#D6A85F]/30 focus:border-[#D6A85F]"
          }`}
        >
          <option value="">Select Category</option>
          {Object.values(ArtCategory).map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        {formik.touched.category && formik.errors.category && (
          <p className="text-red-500 text-sm mt-1">{formik.errors.category}</p>
        )}
      </div>

      {/* Medium */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Medium
        </label>
        <select
          name="medium"
          value={formik.values.medium}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          required
          className={`w-full border-2 rounded-lg px-4 py-3 focus:ring-[#D6A85F]/20 bg-white ${
            formik.touched.medium && formik.errors.medium
              ? "border-red-500 focus:border-red-500"
              : "border-[#D6A85F]/30 focus:border-[#D6A85F]"
          }`}
        >
          <option value="">Select Medium</option>
          {Object.values(Medium).map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        {formik.touched.medium && formik.errors.medium && (
          <p className="text-red-500 text-sm mt-1">{formik.errors.medium}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Description
        </label>
        <textarea
          name="description"
          rows={4}
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          required
          className={`w-full border-2 rounded-lg px-4 py-3 focus:ring-[#D6A85F]/20 bg-white ${
            formik.touched.description && formik.errors.description
              ? "border-red-500 focus:border-red-500"
              : "border-[#D6A85F]/30 focus:border-[#D6A85F]"
          }`}
        />
        {formik.touched.description && formik.errors.description && (
          <p className="text-red-500 text-sm mt-1">
            {formik.errors.description}
          </p>
        )}
      </div>

      {/* Image Upload + Cropper */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Upload Images (crop each)
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={onFileChange}
          className="mb-2"
        />

        {/* Cropper UI */}
        {selectedImage && (
          <div className="relative h-64 w-full mb-4 rounded-lg overflow-hidden border border-gray-300">
            <Cropper
              image={URL.createObjectURL(selectedImage)}
              crop={crop}
              zoom={zoom}
              aspect={4 / 3}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
        )}

        {selectedImage && (
          <div className="flex gap-2 mb-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setSelectedImage(null)}
              className="bg-white"
            >
              Cancel
            </Button>
            <Button type="button" disabled={cropping} onClick={handleCropSave}>
              {cropping ? "Cropping" : "Save Crop"}
            </Button>
          </div>
        )}

        {/* Display thumbnails of cropped images */}
        {croppedImages.length > 0 && (
          <div className="flex flex-wrap gap-4">
            {croppedImages.map((file, idx) => {
              const url = URL.createObjectURL(file);
              return (
                <div
                  key={idx}
                  className="relative w-24 h-24 border border-gray-300 rounded overflow-hidden"
                >
                  <img
                    src={url}
                    alt={`Cropped ${idx + 1}`}
                    className="object-cover w-full h-full"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700"
                    aria-label="Remove image"
                  >
                    &times;
                  </button>
                </div>
              );
            })}
          </div>
        )}
        {formik.touched.images && formik.errors.images && (
          <p className="text-red-500 text-sm mt-1">{formik.errors.images}</p>
        )}
      </div>

      {/* Submit and Cancel buttons */}
      <div className="flex justify-end gap-4 mt-6">
        <Button variant="outline" onClick={cancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={formik.isSubmitting}>
          {formik.isSubmitting ? "Submitting" : "Add Artwork"}
        </Button>
      </div>
    </form>
  );
};

export default ArtworkForm;

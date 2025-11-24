import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Product dropdown options
const productOptions = [
  { value: "", label: "-- Select a product --" },
  { value: "Custom T-Shirt", label: "Custom T-Shirt" },
  { value: "Personalized Mug", label: "Personalized Mug" },
  { value: "Custom Tote Bag", label: "Custom Tote Bag" }
];

// Schema validation
const schema = yup.object().shape({
  productName: yup.string().required("Product is required"),
  quantity: yup
    .number()
    .required("Quantity is required")
    .min(1, "Minimum quantity is 1")
    .max(100, "Maximum quantity is 100"),
  designImage: yup
    .mixed()
    .test("required", "Design image is required", value => value && value.length > 0)
    .test("fileType", "Only JPG and PNG files allowed", value =>
      value && value.length > 0
        ? ["image/jpeg", "image/png"].includes(value[0]?.type)
        : false
    )
});

export default function CustomizationForm({ onSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({ resolver: yupResolver(schema) });

  const internalSubmit = (data) => {
    // Pass the file object for backend/file handling
    onSubmit({
      productName: data.productName,
      quantity: data.quantity,
      designImage: data.designImage[0], // actual file object
    });
    reset();
  };

  return (
    <form className="customization-form" onSubmit={handleSubmit(internalSubmit)} noValidate>
      <div>
        <label>Choose a product</label>
        <select {...register("productName")}>
          {productOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <p className="form-error">{errors.productName?.message}</p>
      </div>

      <div>
        <label>Quantity</label>
        <input type="number" {...register("quantity")} min="1" max="100" />
        <p className="form-error">{errors.quantity?.message}</p>
      </div>

      <div>
        <label>Upload design (JPG/PNG)</label>
        <input type="file" {...register("designImage")} accept=".jpg,.jpeg,.png" />
        <p className="form-error">{errors.designImage?.message}</p>
      </div>

      <button className="btn-green" type="submit" style={{marginTop:10}}>Add to Cart</button>
    </form>
  );
}

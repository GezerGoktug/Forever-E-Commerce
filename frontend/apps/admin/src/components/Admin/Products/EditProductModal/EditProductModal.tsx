import { IoCloudUploadOutline } from "react-icons/io5";
import styles from "./EditProductModal.module.scss";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { type ChangeEvent, useState } from "react";
import clsx from "clsx";
import toast from "react-hot-toast";
import { Input, Button } from "@forever/ui-kit";
import type { SizeType } from "@/types/product.type";
import { type ProductToEdit } from "@/components/Admin/Products/Products";
import { productSchema } from "@/schemas/schema";
import { useUpdateProductMutation } from "@/services/hooks/mutations/product.mutations";
import { handleShowApiErrorWithToastMessages } from "@/utils/common.utils";
import { getSize } from "@/utils/product.utils";

interface EditProductModalProps {
  data: ProductToEdit | undefined;
  closeModal: () => void;
}

type ImageField = "mainImage" | "subImage1" | "subImage2" | "subImage3";

type ImagePreviews = Record<ImageField, string | null>;

type ProductFormValues = z.infer<typeof productSchema>;

const SUB_IMAGE_FIELDS: ImageField[] = ["subImage1", "subImage2", "subImage3"];

const SIZES: SizeType[] = ["SMALL", "MEDIUM", "LARGE", "XLARGE", "XXLARGE"];

const EditProductModal = ({ data, closeModal }: EditProductModalProps) => {
  const [images, setImages] = useState<ImagePreviews>({
    mainImage: data?.image ?? null,
    subImage1: data?.subImages[1] ?? null,
    subImage2: data?.subImages[2] ?? null,
    subImage3: data?.subImages[3] ?? null,
  });

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      mainImage: null,
      subImage1: null,
      subImage2: null,
      subImage3: null,
      name: data?.name,
      description: data?.description,
      price: Number(data?.price),
      sizes: data?.sizes,
      category: data?.category,
      subCategory: data?.subCategory
    },
  });

  const { mutate, isPending } = useUpdateProductMutation({
    onSuccess: (response) => {
      toast.success(response.data.message);
      form.reset();
      closeModal();
    },
    onError: (error) => handleShowApiErrorWithToastMessages(error),
  });

  const selectedSizes = form.watch("sizes");

  const onChangeImage = (e: ChangeEvent<HTMLInputElement>, field: ImageField) => {
    const file = e.target.files ? e.target.files[0] : undefined;

    if (file) {
      const url = URL.createObjectURL(file);
      setImages((prev) => ({ ...prev, [field]: url }));
      form.setValue(field, file);
    }
  };

  const onChangeSizes = (value: SizeType) => {
    const isInSizesArray = form
      .getValues("sizes")
      .some((size) => size === value);
    if (isInSizesArray) {
      form.setValue(
        "sizes",
        form.getValues("sizes").filter((size) => size !== value)
      );
    } else {
      form.setValue("sizes", [...form.getValues("sizes"), value]);
    }
  };

  const onSubmit = (formValues: ProductFormValues) => {
    if (!data)
      return;

    const formData = new FormData();

    if (!formValues.mainImage) {
      toast.error("The product must have one main image.");
      return;
    }

    formData.append("mainImage", formValues.mainImage);
    formData.append("subImage1", formValues.subImage1);
    formData.append("subImage2", formValues.subImage2);
    formData.append("subImage3", formValues.subImage3);

    formData.append("name", formValues.name);
    formData.append("description", formValues.description);
    formData.append("category", formValues.category);
    formData.append("subCategory", formValues.subCategory);
    formData.append("price", JSON.stringify(formValues.price));
    formData.append("sizes", JSON.stringify(formValues.sizes));

    mutate({ id: data._id, updatedProduct: formData });
  };

  return (
    <div className={styles.edit_product_modal_wrapper}>
      <h6>Edit Product</h6>
      <form
        className={styles.edit_product_modal_form}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className={styles.edit_product_modal_files_upload}>
          <div className={styles.edit_product_modal_main_image}>
            {images.mainImage && <img src={images.mainImage} alt="" />}
            <input
              accept="image/*"
              className={styles.edit_product_modal_file_input}
              onChange={(e) => onChangeImage(e, "mainImage")}
              type="file"
            />
            <IoCloudUploadOutline size={40} />
          </div>
          <div className={styles.edit_product_modal_sub_images}>
            {SUB_IMAGE_FIELDS.map((field) => (
              <div key={field} className={styles.edit_product_modal_sub_image}>
                {images[field] && <img src={images[field]} alt="" />}
                <input
                  accept="image/*"
                  className={styles.edit_product_modal_file_input}
                  onChange={(e) => onChangeImage(e, field)}
                  type="file"
                />
                <IoCloudUploadOutline size={40} />
              </div>
            ))}
          </div>
        </div>
        <label>Product Name:</label>
        <Input
          className={styles.edit_product_modal_input}
          placeholder="Name"
          minLength={5}
          {...form.register("name")}
        />
        <label>Description:</label>
        <textarea placeholder="Description" minLength={10} {...form.register("description")} />

        <div className={styles.edit_product_modal_selects}>
          <div className={styles.edit_product_modal_select_section}>
            <label>Category:</label>
            <select {...form.register("category")}>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
            </select>
          </div>
          <div className={styles.edit_product_modal_select_section}>
            <label>Sub Category:</label>
            <select {...form.register("subCategory")}>
              <option value="Topwear">Topwear</option>
              <option value="Bottomwear">Bottomwear</option>
              <option value="Winterwear">Winterwear</option>
            </select>
          </div>
          <div className={styles.edit_product_modal_select_section}>
            <label>Price:</label>
            <Input
              className={styles.edit_product_modal_input}
              type="number"
              placeholder="Price"
              min="1"
              spinButtonClassname={styles.edit_product_modal_input_spin}
              {...form.register("price", {
                setValueAs: (value) => {
                  return Math.max(1, +value)
                },
                onChange: (e) => {
                  const val = e.target.value;
                  e.target.value = +val;
                },
                onBlur: (e) => {
                  const val = e.target.value;
                  e.target.value = Math.max(1, isNaN(val) ? 1 : val);
                }
              })}
            />
          </div>
        </div>
        <label>Select sizes:</label>
        <div className={styles.edit_product_modal_sizes}>
          {SIZES.map((size) => (
            <div
              key={size}
              onClick={() => onChangeSizes(size)}
              className={clsx(styles.edit_product_modal_size, {
                [styles.active]: selectedSizes.includes(size),
              })}
            >
              {getSize(size)}
            </div>
          ))}
        </div>
        <div className={styles.edit_product_modal_errors}>
          {Object.values(form.formState.errors).map((error, i) => (
            <div className={styles.edit_product_modal_error} key={"error_" + i}>
              <span>&#9679;</span>
              <div>{error.message as string}</div>
            </div>
          ))}
        </div>
        <Button loading={isPending} type="submit">
          EDIT
        </Button>
      </form>
    </div>
  );
};

export default EditProductModal;

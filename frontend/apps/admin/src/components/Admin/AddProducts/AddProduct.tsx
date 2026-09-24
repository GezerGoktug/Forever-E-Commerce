import { IoCloudUploadOutline } from "react-icons/io5";
import styles from "./AddProduct.module.scss";
import { useForm } from "react-hook-form";
import { Input, Button } from "@forever/ui-kit";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { type ChangeEvent, useState } from "react";
import type { SizeType } from "@/types/product.type";
import clsx from "clsx";
import toast from "react-hot-toast";
import { productSchema } from "@/schemas/schema";
import { useAddProductMutation } from "@/services/hooks/mutations/product.mutations";
import { handleShowApiErrorWithToastMessages } from "@/utils/common.utils";
import { getSize } from "@/utils/product.utils";

type ImageField = "mainImage" | "subImage1" | "subImage2" | "subImage3";

type ImagePreviews = Record<ImageField, string | null>;

type ProductFormValues = z.infer<typeof productSchema>;

const SUB_IMAGE_FIELDS: ImageField[] = ["subImage1", "subImage2", "subImage3"];

const SIZES: SizeType[] = ["SMALL", "MEDIUM", "LARGE", "XLARGE", "XXLARGE"];

const EMPTY_IMAGE_PREVIEWS: ImagePreviews = {
  mainImage: null,
  subImage1: null,
  subImage2: null,
  subImage3: null,
};

const AddProduct = () => {
  const [images, setImages] = useState<ImagePreviews>(EMPTY_IMAGE_PREVIEWS);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      mainImage: null,
      subImage1: null,
      subImage2: null,
      subImage3: null,
      name: "",
      description: "",
      price: 1,
      sizes: [],
    },
  });

  const { mutate, isPending } = useAddProductMutation({
    onSuccess: (response) => {
      toast.success(response.data.message);
      form.reset();
      setImages(EMPTY_IMAGE_PREVIEWS);
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

  const onSubmit = (data: ProductFormValues) => {
    const formData = new FormData();

    if (!data.mainImage) {
      toast.error("The product must have one main image.");
      return;
    }

    formData.append("mainImage", data.mainImage);
    formData.append("subImage1", data.subImage1);
    formData.append("subImage2", data.subImage2);
    formData.append("subImage3", data.subImage3);

    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("subCategory", data.subCategory);
    formData.append("price", JSON.stringify(data.price));
    formData.append("sizes", JSON.stringify(data.sizes));

    mutate(formData);
  };

  return (
    <div className={styles.add_product_wrapper}>
      <h6>Add Product</h6>
      <form
        className={styles.add_product_form}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className={styles.add_product_form_files_upload}>
          <div className={styles.add_product_form_main_image}>
            {images.mainImage && <img src={images.mainImage} alt="" />}
            <input
              accept="image/*"
              className={styles.add_product_form_file_input}
              onChange={(e) => onChangeImage(e, "mainImage")}
              type="file"
            />
            <IoCloudUploadOutline size={40} />
          </div>
          <div className={styles.add_product_form_sub_images}>
            {SUB_IMAGE_FIELDS.map((field) => (
              <div key={field} className={styles.add_product_form_sub_image}>
                {images[field] && <img src={images[field]} alt="" />}
                <input
                  accept="image/*"
                  className={styles.add_product_form_file_input}
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
          className={styles.add_product_form_input}
          placeholder="Name"
          minLength={5}
          {...form.register("name")}
        />
        <label>Description:</label>
        <textarea placeholder="Description" minLength={10} {...form.register("description")} />

        <div className={styles.add_product_form_group}>
          <div className={styles.add_product_form_group_section}>
            <label>Category:</label>
            <select {...form.register("category")}>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
            </select>
          </div>
          <div className={styles.add_product_form_group_section}>
            <label>Sub Category:</label>
            <select {...form.register("subCategory")}>
              <option value="Topwear">Topwear</option>
              <option value="Bottomwear">Bottomwear</option>
              <option value="Winterwear">Winterwear</option>
            </select>
          </div>

          <div className={styles.add_product_form_group_section}>
            <label>Price:</label>
            <Input
              className={styles.add_product_form_input}
              type="number"
              placeholder="Price"
              min="1"
              spinButtonClassname={styles.add_product_form_input_spin}
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
        <div className={styles.add_product_form_sizes}>
          {SIZES.map((size) => (
            <div
              key={size}
              onClick={() => onChangeSizes(size)}
              className={clsx(styles.add_product_form_size, {
                [styles.active]: selectedSizes.includes(size),
              })}
            >
              {getSize(size)}
            </div>
          ))}
        </div>
        <div className={styles.add_product_form_errors}>
          {Object.values(form.formState.errors).map((error, i) => (
            <div className={styles.add_product_form_error} key={"error_" + i}>
              <span>&#9679;</span>
              <div>{error.message as string}</div>
            </div>
          ))}
        </div>
        <Button loading={isPending} type="submit">
          ADD
        </Button>
      </form>
    </div>
  );
};

export default AddProduct;

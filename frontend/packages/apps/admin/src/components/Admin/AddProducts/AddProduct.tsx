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

type ImagesType = {
  mainImage: string | null;
  subImage1: string | null;
  subImage2: string | null;
  subImage3: string | null;
};

const AddProduct = () => {
  const [images, setImages] = useState<ImagesType>({
    mainImage: null,
    subImage1: null,
    subImage2: null,
    subImage3: null,
  });

  const form = useForm<z.infer<typeof productSchema>>({
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

  const onChangeImage = (
    e: ChangeEvent<HTMLInputElement>,
    field: "mainImage" | "subImage1" | "subImage2" | "subImage3"
  ) => {
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

  const { mutate, isPending } = useAddProductMutation({
    onSuccess: (data) => {
      toast.success(data.data.message);
      form.reset();
      setImages({
        mainImage: null,
        subImage1: null,
        subImage2: null,
        subImage3: null,
      });
    },
    onError: (err) => {
      const apiError = err.response?.data.error.errorMessage;
      if (typeof apiError === "string") {
        toast.error(apiError);
      }
      if (typeof apiError === "object") {
        Object.entries(apiError).forEach(([key, value]) => {
          value.forEach((val) => {
            toast.error(`${key} : ${val}`);
          });
        });
      }
    },
  });

  const onSubmit = (data: z.infer<typeof productSchema>) => {
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
            {images?.mainImage && <img src={images.mainImage} alt="" />}
            <input
              accept="image/*"
              className={styles.add_product_form_file_input}
              onChange={(e) => onChangeImage(e, "mainImage")}
              type="file"
            />
            <IoCloudUploadOutline size={40} />
          </div>
          <div className={styles.add_product_form_sub_images}>
            <div className={styles.add_product_form_sub_image}>
              {images?.subImage1 && <img src={images.subImage1} alt="" />}
              <input
                accept="image/*"
                className={styles.add_product_form_file_input}
                onChange={(e) => onChangeImage(e, "subImage1")}
                type="file"
              />
              <IoCloudUploadOutline size={40} />
            </div>
            <div className={styles.add_product_form_sub_image}>
              {images?.subImage2 && <img src={images.subImage2} alt="" />}
              <input
                accept="image/*"
                className={styles.add_product_form_file_input}
                onChange={(e) => onChangeImage(e, "subImage2")}
                type="file"
              />
              <IoCloudUploadOutline size={40} />
            </div>
            <div className={styles.add_product_form_sub_image}>
              {images?.subImage3 && <img src={images.subImage3} alt="" />}
              <input
                accept="image/*"
                className={styles.add_product_form_file_input}
                onChange={(e) => onChangeImage(e, "subImage3")}
                type="file"
              />
              <IoCloudUploadOutline size={40} />
            </div>
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
          <div
            onClick={() => onChangeSizes("SMALL")}
            className={clsx(styles.add_product_form_size, {
              [styles.active]: form.watch("sizes").includes("SMALL"),
            })}
          >
            S
          </div>
          <div
            onClick={() => onChangeSizes("MEDIUM")}
            className={clsx(styles.add_product_form_size, {
              [styles.active]: form.watch("sizes").includes("MEDIUM"),
            })}
          >
            M
          </div>
          <div
            onClick={() => onChangeSizes("LARGE")}
            className={clsx(styles.add_product_form_size, {
              [styles.active]: form.watch("sizes").includes("LARGE"),
            })}
          >
            L
          </div>
          <div
            onClick={() => onChangeSizes("XLARGE")}
            className={clsx(styles.add_product_form_size, {
              [styles.active]: form.watch("sizes").includes("XLARGE"),
            })}
          >
            X
          </div>
          <div
            onClick={() => onChangeSizes("XXLARGE")}
            className={clsx(styles.add_product_form_size, {
              [styles.active]: form.watch("sizes").includes("XXLARGE"),
            })}
          >
            XXL
          </div>
        </div>
        <div className={styles.add_product_form_errors}>
          {Object.values(form.formState.errors).map((val, i) => (
            <div className={styles.add_product_form_error} key={"error_" + i}>
              <span>&#9679;</span>
              <div>{val.message as string}</div>
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

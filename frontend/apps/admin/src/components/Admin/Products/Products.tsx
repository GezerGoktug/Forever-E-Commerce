import styles from "./Products.module.scss";
import { FaPencil, FaTrash } from "react-icons/fa6";
import clsx from "clsx";
import { useState } from "react";
import {
  IoIosArrowDropleftCircle,
  IoIosArrowDroprightCircle,
} from "react-icons/io";
import { Modal } from "@forever/ui-kit";
import DeleteProductModal from "./DeleteProductModal/DeleteProductModal";
import EditProductModal from "./EditProductModal/EditProductModal";
import { type ExtendedProduct } from "@/types/product.type";
import { useGetProductsForAdminQuery } from "@/services/hooks/queries/product.query";
import { useIsAdmin } from "@/store/auth/hooks";

interface ModalState<T> {
  modal_type: "DELETE" | "EDIT";
  data: T;
}

export type ProductToEdit = Pick<
  ExtendedProduct,
  | "_id"
  | "name"
  | "description"
  | "price"
  | "sizes"
  | "image"
  | "subImages"
  | "category"
  | "subCategory"
>;
export type ProductToDelete = Pick<ExtendedProduct, "_id">;

const Products = () => {
  const isAdmin = useIsAdmin();

  const [page, setPage] = useState(0);
  const [modal, setModal] = useState<ModalState<
    ProductToEdit | ProductToDelete
  > | null>(null);

  const { data } = useGetProductsForAdminQuery({ page }, {
    enabled: isAdmin
  });

  const closeModal = () => setModal(null);

  const goToPrevPage = () => setPage(data?.data.hasPrev ? page - 1 : page);

  const goToNextPage = () => setPage(data?.data.hasNext ? page + 1 : page);

  return (
    <div>
      <DeleteProductModal
        open={modal?.modal_type === "DELETE"}
        data={modal?.data as ProductToDelete | undefined}
        closeModal={closeModal}
      />
      <Modal
        open={modal?.modal_type === "EDIT"}
        closeModal={closeModal}
      >
        <EditProductModal
          data={modal?.data as ProductToEdit | undefined}
          closeModal={closeModal}
        />
      </Modal>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Sub category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.data.content.map((product) => (
            <tr key={product._id}>
              <td>
                <img src={product.image} alt="" />
              </td>
              <td>{product.name}</td>
              <td>{product.price}$</td>
              <td>{product.category}</td>
              <td>{product.subCategory}</td>
              <td>
                <div className={styles.actions}>
                  <div className={clsx(styles.actions_icon, styles.remove)}>
                    <FaTrash
                      onClick={() =>
                        setModal({
                          modal_type: "DELETE",
                          data: {
                            _id: product._id,
                          },
                        })
                      }
                      fill="white"
                      size={15}
                    />
                  </div>
                  <div
                    onClick={() =>
                      setModal({
                        modal_type: "EDIT",
                        data: {
                          _id: product._id,
                          name: product.name,
                          price: product.price,
                          description: product.description,
                          sizes: product.sizes,
                          image: product.image,
                          subImages: product.subImages,
                          category: product.category,
                          subCategory: product.subCategory,
                        },
                      })
                    }
                    className={clsx(styles.actions_icon, styles.edit)}
                  >
                    <FaPencil fill="white" size={15} />
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.pagination}>
        <div
          onClick={goToPrevPage}
          className={clsx(styles.pagination_item, {
            [styles.disabled]: !data?.data.hasPrev,
          })}
        >
          <IoIosArrowDropleftCircle fill="white" size={25} />
        </div>
        <div className={styles.pagination_item}>{page + 1}</div>
        <div
          onClick={goToNextPage}
          className={clsx(styles.pagination_item, {
            [styles.disabled]: !data?.data.hasNext,
          })}
        >
          <IoIosArrowDroprightCircle fill="white" size={25} />
        </div>
      </div>
    </div>
  );
};

export default Products;

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Modal } from "bootstrap";
import { NavLink, useNavigate } from "react-router-dom"; 
import ReactLoading from "react-loading";
import Pagination from "../../components/Pagination";
import ProductModal from "../../components/ProductModal";
import DelProductModal from "../../components/DelProductModal";
import Toast from "../../layouts/Toast";



const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

const defaultModalState = {
  imageUrl: "",
  title: "",
  category: "",
  unit: "",
  origin_price: "",
  price: "",
  description: "",
  content: "",
  is_enabled: 0,
  imagesUrl: [""],
};

const adminRoutes = [
  { path: "/admin/products", name: "新增產品" },
  { path: "/admin/orders", name: "客戶訂單" },
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [isScreenLoading, setIsScreenLoading ] = useState(false);//預設全螢幕loading為關閉狀態
  const productModalRef = useRef(null);
  const delProductModalRef = useRef(null);
  const [modalMode, setModalMode] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isDelProductModalOpen, setIsDelProductModalOpen] = useState(false);
  const [tempProduct, setTempProduct] = useState(defaultModalState);
  const [pageInfo, setPageInfo] = useState({});
  const navigate = useNavigate();


  const getProducts = async (page = 1) => {
    setIsScreenLoading(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/v2/api/${API_PATH}/admin/products?page=${page}`
      );
      setProducts(res.data.products);
      setPageInfo(res.data.pagination);
    } catch (error) {
      alert("取得產品失敗");
      //console.log(error.message)
    } finally{
      setIsScreenLoading(false);//取得API之後關閉全螢幕loading狀態
    } 
  };

  useEffect(() => {
    if (productModalRef.current) {
      new Modal(productModalRef.current, {
        backdrop: false,
      });
    }
  
    if (delProductModalRef.current) {
      new Modal(delProductModalRef.current, {
        backdrop: false,
      });
    }
  
    getProducts();
  }, []);

const handleOpenProductModal = (mode, product) => {
  setModalMode(mode);

  switch (mode) {
    case "create":
      //setTempProduct(defaultModalState);
      setTempProduct({ ...defaultModalState });
      break;

    case "edit":
      setTempProduct(product);
      break;
    default:
      break;
  }
  setIsProductModalOpen(true);

  // const modalInstance = Modal.getInstance(productModalRef.current);
  // modalInstance.show();
};

  const handleOpenDelProductModal = (product) => {
  setTempProduct(product);
  setIsDelProductModalOpen(true)
  // const modalInstance = Modal.getInstance(delProductModalRef.current);
  // modalInstance.show();
};

  const handlePageChange = (page) => {
    getProducts(page);
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${BASE_URL}/v2/logout/`);
      navigate("/login");
    } catch (error) {
      alert("登出失敗");
    };
  };

  return(
    <>
      <nav className="navbar bg-dark border-bottom border-body" data-bs-theme="dark">
      <div className="container d-flex justify-content-between align-items-center">
        <ul className="navbar-nav flex-row gap-5 fs-5 align-items-center">
          {adminRoutes.map ((route) =>( 
            <li key={route.path} className="nav-item">
            <NavLink className="nav-link" aria-current="page" to={route.path}>{route.name}</NavLink>
          </li>
          ))}
        </ul>
        <div>
          <div className="justify-content-end">
            <button onClick={handleLogout} type="button" className="btn btn-secondary" style={{ height: "100%" }}>
              登出
            </button>
          </div>
        </div>
      </div>
      </nav>

      <div className="container py-5">
          <div className="row">
            <div className="col">
              <div className="d-flex justify-content-between">
                <h2>產品列表</h2>
                <button
                  onClick={() => handleOpenProductModal("create")}
                  type="button"
                  className="btn btn-primary"
                >
                  建立新的產品
                </button>
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">產品名稱</th>
                    <th scope="col">原價</th>
                    <th scope="col">售價</th>
                    <th scope="col">是否啟用</th>
                    <th scope="col">查看細節</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <th scope="row">{product.title}</th>
                      <td>{product.origin_price}</td>
                      <td>{product.price}</td>
                      <td>{product.is_enabled ? (<span className="text-success">啟用</span>): (<span>未啟用</span>)}</td>
                      <td>
                        <div className="btn-group">
                          <button
                            onClick={() =>
                              handleOpenProductModal('edit', product)
                            }
                            type="button"
                            className="btn btn-outline-primary btn-sm"
                          >編輯</button>
                          <button onClick={()=>handleOpenDelProductModal(product)} type="button" className="btn btn-outline-danger btn-sm">刪除</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination pageInfo={pageInfo} handlePageChange={handlePageChange} ></Pagination>
      </div>
      <ProductModal 
      tempProduct={tempProduct}
      getProducts={getProducts}
      modalMode={modalMode}
      isOpen={isProductModalOpen}
      setIsOpen={setIsProductModalOpen}
      />

      <DelProductModal
      tempProduct={tempProduct}
      getProducts={getProducts}
      isOpen={isDelProductModalOpen}
      setIsOpen={setIsDelProductModalOpen}
      />

      { isScreenLoading && (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(255,255,255,0.3)",
          zIndex: 999,}}
        >
          <ReactLoading type="spin" color="black" width="4rem" height="4rem" />
        </div>
      )}
      <Toast />
    </>
  )
}
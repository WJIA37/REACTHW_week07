function Pagination({
  pageInfo,
  handlePageChange
}) {
  return (
    <div className="d-flex justify-content-center">
      <nav>
        <ul className="pagination">
          <li className={`page-item ${!pageInfo.has_pre && "disabled"}`}>
            {/*判斷pageInfo有沒有上一頁,如果false加一個Class="disabled"加一個Class="disabled"*/}
            <button type="button"
              onClick={() => handlePageChange(pageInfo.current_page - 1)}
              className="page-link">
              上一頁
            </button>
          </li>

          {Array.from({ length: pageInfo.total_pages }).map((_, index) => (
            <li
              key={index}
              className={`page-item ${
                pageInfo.current_page === index + 1 && "active"
              }`}>
              {/*判斷current_page === index + 1加一個Class="active"*/}
              <button type="button"
                onClick={() => handlePageChange(index + 1)}
                className="page-link">
                {index + 1}
              </button>
            </li>
          ))}
          <li className={`page-item ${!pageInfo.has_next && "disabled"}`}>
            <button type="button"
              onClick={() => handlePageChange(pageInfo.current_page + 1)}
              className="page-link"
              href="#">下一頁
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Pagination;

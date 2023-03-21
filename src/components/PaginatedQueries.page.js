import React, { useState } from "react";
import axios from "axios";
import { useQuery } from "react-query";

const fetchColors = (pageNumber) => {
  return axios.get(`http://localhost:4000/colors?_limit=2&_page=${pageNumber}`);
};

function PaginatedQueries() {
  const [pageNumber, setPageNumber] = useState(1);
  const { isLoading, isError, error, data, isFetching } = useQuery(
    ["colors", pageNumber],
    () => fetchColors(pageNumber),
    {
      // Tối ưu trải nghiệm người dùng bằng cách giữ lại giá trị trước đó, khi nào giá trị mới được fetch thành công thì mới hiển thị
      keepPreviousData: true,
    }
  );
  if (isLoading) {
    return <h2>Loading...</h2>;
  }
  if (isError) {
    return <h2>{error.message}</h2>;
  }
  return (
    <>
      <div>
        {data?.data.map((color) => {
          return (
            <div style={{ fontSize: "20px", fontWeight: "700" }} key={color.id}>
              {color.id}-{color.label}
            </div>
          );
        })}
      </div>
      <div>
        <button
          disabled={pageNumber === 1}
          onClick={() => setPageNumber((page) => page - 1)}
        >
          Prev page
        </button>
        <button
          disabled={pageNumber === 4}
          onClick={() => setPageNumber((page) => page + 1)}
        >
          next page
        </button>
        {isFetching && <span>Loading...</span>}
      </div>
    </>
  );
}

export default PaginatedQueries;

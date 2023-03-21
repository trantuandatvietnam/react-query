# React query là gì?

- Đây là một thư viện giúp `fetching data` (Tìm nạp dữ liệu) trong ứng dụng React
- `Client state` vs `Server state`

  - `Client state`: Tồn tại bên trong bộ nhớ ứng dụng. Chúng ta có thể truy cập và update nó một cách `synchronous`
  - `Server state`: Được duy trì từ xa trong cơ sở dữ liệu và yêu cầu `asynchronous` => cần api để fetching hoặc updateing, ngoài ra `server state` còn được sở hữu chung => Dữ liệu có thể được sửa từ người khác mà bạn không biết và `UI data` sẽ không đồng bộ với `remote data`

- Trong series này sẽ được học:
  - Basic query
  - Poll data
  - RQ dev tools
  - Create reusable query hooks
  - Query by ID
  - Parllel queries
  - Dynamic queries
  - Dependent queries
  - Infinite & paginated queries
  - Update data using mutations
  - Invalidate queries
  - Optimistic updates
  - Axios Interceptor

### Sự khác nhau giữa việc sử dụng axios thông thường với React query

- Khi vào một component, các fetch thông thường sẽ luôn call lại và cập nhật dữ liệu dữ liệu. Tuy nhiên đối với react query, nó vẫn sẽ call nhưng chỉ cập nhật lại dữ liệu khi có sự thay đổi

```js
import axios from "axios";
import React from "react";
import { useQuery } from "react-query";

function RQSuperHeroes() {
  const { data, isLoading, isError, error } = useQuery("super-heroes", () => {
    return axios.get("http://localhost:4000/superheroes");
  });

  if (isLoading) return <h2>Loading...</h2>;
  if (isError) return <h2>{error.error}</h2>;
  return (
    <>
      <h2>default Heroes </h2>
      {data?.data?.map((hero) => {
        return <div key={hero.id}>{hero.name}</div>;
      })}
    </>
  );
}

export default RQSuperHeroes;
```

### React Query DevTool

- Debug quản lý server state

### Một số điều có thể xảy ra trong server state và React query giải quyết được vấn đề

- Catching
- Gộp nhiều requests cho cùng một dữ liệu thành một request
- Cập nhật dữ liệu cũ trong nền
- Biết khi nào dữ liệu lỗi thời
- Refecling (phản ánh) dữ liệu nhanh nhất có thể
- Tối ưu performance như phân trang, lazy load data
- Quản lý bộ nhớ và thu gom rác của server state
- Ghi nhớ kết quả truy vấn với `structural sharing`

### Query Cache

- Theo mặc định, kết quả của mọi query đều được lưu trong cache trong 5p. Cơ chế của nó là: Khi dữ liệu được fetch thành công, query sẽ lưu data vào bộ nhớ đệm bằng cách sử dụng `query key`

### Default Options

- Trong `React query`, nó cung cấp một số option để cung cấp một số hành vi mặc định
  - Tự động call api sau khoảng thời gian `n ms`
  - Cache time
  - StaleTime (Mặc định là 0, nó sẽ call api lập tức (Trong chế độ nền) khi chuyển đến tab xử lý call api) => đặt giá trị lớn hơn thì nó sẽ tính tổng thời gian ở tab khác, nếu tổng thời gian ở tab khác mà lớn hơn thời gian setup thì nó mới fetch lại dữ liệu
  - refetch on forcus window
  - refetch interval: Tự động refetch sau một khoảng thời gian (Chỉ thực hiện khi đang forcus vào trình duyệt)
  - refetch interval in background (hoạt động nền ngay cả khi không focus vào trình duyệt)
  - enabled: false => Không call api khi mount, sử dụng cái này để custom hành vi call api theo một event khác (Ví dụ user event: Khi người dùng click vào nút thì mới cho gọi api (Sử dụng `refetch` VD: `onClick={refetch}`))

### Success and Error Callbacks

- Callback này sẽ được thực hiện khi fetch thành công hoặc thất bại (Được triggle mỗi lần fetching)

```js
import axios from "axios";
import React from "react";
import { useQuery } from "react-query";

const fetchList = () => {
  return axios.get("http://localhost:4000/superheroes");
};

function RQSuperHeroes() {
  const onSuccess = () => {
    console.log("Update successfully");
  };
  const onError = () => {
    console.log("Update fail");
  };
  const response = useQuery("super-heroes", fetchList, {
    staleTime: 5000,
    onSuccess,
    onError,
  });
  const { data, isLoading, isError, error } = response;

  if (isLoading) return <h2>Loading...</h2>;
  if (isError) return <h2>{error.message}</h2>;
  return (
    <>
      <h2>default Heroes </h2>
      {data?.data?.map((hero) => {
        return <div key={hero.id}>{hero.name}</div>;
      })}
    </>
  );
}

export default RQSuperHeroes;
```

### Data Transformation

- Đôi khi cần chuyển đổi định dạng dữ liệu sau khi call api thành công để sử dụng:

```js
const response = useQuery("super-heroes", fetchList, {
  onSuccess,
  onError,
  select: (res) => {
    return res.data.map((hero) => hero.name);
  },
});
```

### Custom Query Hook

- Trong ứng dụng lớn, việc các component khác nhau gọi đến cùng một API là điều có thể xảy ra. Thay vì sử dụng coppy logic cũ để call api thì ta có thể dùng custom hook như sau:

```js
import axios from "axios";
import { useQuery } from "react-query";

const fetchList = () => {
  return axios.get("http://localhost:4000/superheroes");
};

function useSuperHeroesData(onSuccess, onError) {
  return useQuery("super-heroes", fetchList, {
    onSuccess,
    onError,
    select: (res) => {
      return res.data.map((hero) => hero.name);
    },
  });
}

export default useSuperHeroesData;
```

### Query by Id

```js
import axios from "axios";
import { useQuery } from "react-query";

const fetchList = ({ queryKey }) => {
  const heroId = queryKey[1];
  return axios.get(`http://localhost:4000/superheroes/${heroId}`);
};

function useSuperHeroesDetail(onSuccess, onError, id) {
  return useQuery(["super-heroes", id], fetchList, {
    onSuccess,
    onError,
  });
}

export default useSuperHeroesDetail;
```

=> Việc query theo ID sẽ giúp react query ghi nhớ được chính xác api nào đã được gọi và api nào chưa được gọi

### Parallel Queries (Truy vấn song song)

- Đơn giản là thực hiện gọi nhiều api. Tuy nhiên cần thay đổi biến đầu ra như sau:

```js
import axios from "axios";
import React from "react";
import { useQuery } from "react-query";

const fetchSuperHeroes = () => {
  return axios.get("http://localhost:4000/superheroes");
};

const fetchFriends = () => {
  return axios.get("http://localhost:4000/friends");
};

function ParallelQueries() {
  const { data: superHeroes } = useQuery("super-heroes", fetchSuperHeroes);
  const { data: friends } = useQuery("friends", fetchFriends);
  console.log({ superHeroes, friends });
  return <div>ParallelQueries</div>;
}

export default ParallelQueries;
```

### Dynamic Parallel Queries

- Giả sử có một mảng ids chưa biết rõ là có bao nhiêu phần tử => Yêu cầu thực hiện truy vấn lấy thông tin của chúng

```js
import axios from "axios";
import React from "react";
import { useQueries } from "react-query";

const fetchSuperHeroes = (heroId) => {
  return axios.get(`http://localhost:4000/superheroes/${heroId}`);
};

function DynamicParallelQueries({ heroeIds }) {
  const queryResults = useQueries(
    heroeIds.map((id) => {
      return {
        queryKey: ["super-hero", id],
        queryFn: () => fetchSuperHeroes(id),
      };
    })
  );
  console.log(queryResults);
  return <div>DynamicParallelQueries</div>;
}

export default DynamicParallelQueries;
```

### Dependent queries

```js
import React from "react";
import axios from "axios";
import { useQuery } from "react-query";

const fetchUserByEmail = (email) => {
  return axios.get(`http://localhost:4000/users/${email}`);
};

const fetchUserByChannelId = (email) => {
  return axios.get(`http://localhost:4000/channels/${email}`);
};

export const DependentQueriesPage = ({ email = "dat130902@gmail.com" }) => {
  const { data: user } = useQuery(["user", email], () =>
    fetchUserByEmail(email)
  );
  const channelId = user?.data.channelId;
  useQuery(["courses", channelId], () => fetchUserByChannelId(channelId), {
    enabled: !!channelId,
  });
  return <div>DependentQueriesPage</div>;
};
```

### Initial Query Data

- Sử dụng để tối ưu trải nghiệm người dùng
- Giả sử khi chúng ta có một danh sách người dùng được hiển thị trong một trang, khi click vào người dùng đó sẽ hiển thị thông tin chi tiết mà không cần phải gọi truy vấn (Trong trường hợp người dùng đó được lưu trong cache, nếu không có thì gọi api như thường)

```js
import axios from "axios";
import { useQuery, useQueryClient } from "react-query";

const fetchList = ({ queryKey }) => {
  const heroId = queryKey[1];
  return axios.get(`http://localhost:4000/superheroes/${heroId}`);
};

function useSuperHeroesDetail(onSuccess, onError, id) {
  const queryClient = useQueryClient();
  return useQuery(["super-heroes", id], fetchList, {
    onSuccess,
    onError,
    initialData: () => {
      // GET ALL DATA IN CACHE OF GET ALL
      const hero = queryClient
        .getQueryData("super-heroes")
        ?.data.find((hero) => hero.id === parseInt(id));
      if (hero) {
        return { data: hero };
      } else {
        return undefined;
      }
    },
  });
}

export default useSuperHeroesDetail;
```

### Paginated Queries

```js
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
```

### Infinite Queries

```js
import { Fragment } from "react";
import { useInfiniteQuery } from "react-query";
import axios from "axios";

const fetchColors = ({ pageParam = 1 }) => {
  return axios.get(`http://localhost:4000/colors?_limit=2&_page=${pageParam}`);
};

const InfiniteQuery = () => {
  const {
    isLoading,
    isError,
    error,
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery(["colors"], fetchColors, {
    getNextPageParam: (_lastPage, pages) => {
      if (pages.length < 4) {
        return pages.length + 1;
      } else {
        return undefined;
      }
    },
  });

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  if (isError) {
    return <h2>{error.message}</h2>;
  }

  return (
    <>
      <div>
        {data?.pages.map((group, i) => {
          return (
            <Fragment key={i}>
              {group.data.map((color) => (
                <h2 key={color.id}>
                  {color.id} {color.label}
                </h2>
              ))}
            </Fragment>
          );
        })}
      </div>
      <div>
        <button onClick={fetchNextPage} disabled={!hasNextPage}>
          Load more
        </button>
      </div>
      <div>{isFetching && !isFetchingNextPage ? "Fetching..." : null}</div>
    </>
  );
};

export default InfiniteQuery;
```

### Mutations

```js
import { useState } from "react";

import { Link } from "react-router-dom";
import useSuperHeroesData, {
  useAddSuperHeroData,
} from "../hooks/useSuperHeroesData";

const RQSuperHeroesPage = () => {
  const [name, setName] = useState("");
  const [alterEgo, setAlterEgo] = useState("");

  const onSuccess = (data) => {
    console.log({ data });
  };

  const onError = (error) => {
    console.log({ error });
  };

  const { isLoading, data, isError, error, refetch } = useSuperHeroesData(
    onSuccess,
    onError
  );

  const { mutate: addHero } = useAddSuperHeroData();

  const handleAddHeroClick = () => {
    const hero = { name, alterEgo };
    addHero(hero);
  };

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  if (isError) {
    return <h2>{error.message}</h2>;
  }

  return (
    <>
      <h2>React Query Super Heroes Page</h2>
      <div>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          value={alterEgo}
          onChange={(e) => setAlterEgo(e.target.value)}
        />
        <button onClick={handleAddHeroClick}>Add Hero</button>
      </div>
      <button onClick={refetch}>Fetch heroes</button>
      {data?.data.map((hero) => {
        return (
          <div key={hero.id}>
            <Link to={`/rq-super-heroes/${hero.id}`}>
              {hero.id} {hero.name}
            </Link>
          </div>
        );
      })}
      {/* {data.map(heroName => {
        return <div key={heroName}>{heroName}</div>
      })} */}
    </>
  );
};

export default RQSuperHeroesPage;


// useSuperHeroesData.js
import axios from "axios";
import { useQuery, useMutation } from "react-query";

const fetchList = () => {
  return axios.get("http://localhost:4000/superheroes");
};

function useSuperHeroesData(onSuccess, onError) {
  return useQuery("super-heroes", fetchList, {
    onSuccess,
    onError,
  });
}

const addSuperHero = (hero) => {
  return axios.post("http://localhost:4000/superheroes", hero);
};

export const useAddSuperHeroData = () => {
  return useMutation(addSuperHero);
};

export default useSuperHeroesData;
```

=> Tuy nhiên nếu làm kiểu trên thì dữ liệu sẽ không được tự cập nhật sau khi post thành công mà phải reload mới nhận, để khắc phục điều này, chúng ta cùng đến với bài tiếp theo

### Query Invalidation

- Code dựa vào phần trên, chỉ thay đổi function call

```js
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "react-query";

const fetchList = () => {
  return axios.get("http://localhost:4000/superheroes");
};

function useSuperHeroesData(onSuccess, onError) {
  return useQuery("super-heroes", fetchList, {
    onSuccess,
    onError,
  });
}

const addSuperHero = (hero) => {
  return axios.post("http://localhost:4000/superheroes", hero);
};

export const useAddSuperHeroData = () => {
  const queryClient = useQueryClient();
  return useMutation(addSuperHero, {
    onSuccess: () => {
      queryClient.invalidateQueries("super-heroes");
    },
  });
};

export default useSuperHeroesData;
```

### Handling Mutation Response

- Chúng ta thấy rằng, ở những bài trước, sau khi post thành công thì nó sẽ trả ra một đối tượng vừa được tạo. Sau đó nó lại tiếp tục gọi api để lấy toàn bộ danh sách để hiển thị lên màn hình => Điều này là không cần thiết. Chỉ cần lấy dữ liệu ở api post trả về, sau đó update ở client là tuyệt vời rồi :v

```js
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "react-query";

const fetchList = () => {
  return axios.get("http://localhost:4000/superheroes");
};

function useSuperHeroesData(onSuccess, onError) {
  return useQuery("super-heroes", fetchList, {
    onSuccess,
    onError,
  });
}

const addSuperHero = (hero) => {
  return axios.post("http://localhost:4000/superheroes", hero);
};

export const useAddSuperHeroData = () => {
  const queryClient = useQueryClient();
  return useMutation(addSuperHero, {
    onSuccess: (data) => {
      // queryClient.invalidateQueries("super-heroes");
      queryClient.setQueryData("super-heroes", (oldQueryData) => {
        return {
          ...oldQueryData,
          data: [...oldQueryData.data, data.data],
        };
      });
    },
  });
};

export default useSuperHeroesData;
```

### Optimistic Updates (Cập nhật lạc quan )

- Việc update state trước khi mutate xảy ra làm cho ứng dụng có vẻ nhanh hơn (Kiểu như chúng ta mặc định là thành công trong mọi trường hợp, nếu thất bại, nó sẽ cập nhật lại lần nữa :v) Tuy nhiên màn hình sẽ nháy (Bởi nó bị lỗi)

```js
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "react-query";

const fetchList = () => {
  return axios.get("http://localhost:4000/superheroes");
};

function useSuperHeroesData(onSuccess, onError) {
  return useQuery("super-heroes", fetchList, {
    onSuccess,
    onError,
  });
}

const addSuperHero = (hero) => {
  return axios.post("http://localhost:4000/superheroes", hero);
};

export const useAddSuperHeroData = () => {
  const queryClient = useQueryClient();
  return useMutation(addSuperHero, {
    // `newHero` chính là hero trong hàm `addSuperHero`
    onMutate: async (newHero) => {
      // Cancel get all
      await queryClient.cancelQueries("super-heroes");
      const previousHeroData = queryClient.getQueryData("super-heroes");
      queryClient.setQueryData("super-heroes", (oldQueryData) => {
        return {
          ...oldQueryData,
          data: [
            ...oldQueryData.data,
            {
              id: oldQueryData?.data?.length + 1,
              ...newHero,
            },
          ],
        };
      });
      return {
        previousHeroData,
      };
    },
    onError: (_error, _hero, context) => {
      queryClient.setQueryData("super-heroes", context.previousHeroData);
    },
    // luôn chạy dù thành công hay thất bại
    onSettled: () => {
      queryClient.invalidateQueries("super-heroes");
    },
  });
};

export default useSuperHeroesData;
```

### Axios Interceptor

```js
import axios from "axios";

const client = axios.create({ baseURL: "http://localhost:4000" });

export const request = ({ ...options }) => {
  client.defaults.headers.common.Authorization = `Bearer token`;
  const onSuccess = (response) => response;
  const onError = (error) => {
    // optional catch errors and add additional logging here
    return error;
  };
  return client(options).then(onSuccess).catch(onError);
};

// USE
import { useState } from "react";

import { Link } from "react-router-dom";
import useSuperHeroesData, {
  useAddSuperHeroData,
} from "../hooks/useSuperHeroesData";

const RQSuperHeroesPage = () => {
  const [name, setName] = useState("");
  const [alterEgo, setAlterEgo] = useState("");

  const onSuccess = (data) => {
    console.log({ data });
  };

  const onError = (error) => {
    console.log({ error });
  };

  const { isLoading, data, isError, error, refetch } = useSuperHeroesData(
    onSuccess,
    onError
  );

  const { mutate: addHero } = useAddSuperHeroData();

  const handleAddHeroClick = () => {
    const hero = { name, alterEgo };
    addHero(hero);
  };

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  if (isError) {
    return <h2>{error.message}</h2>;
  }

  return (
    <>
      <h2>React Query Super Heroes Page</h2>
      <div>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          value={alterEgo}
          onChange={(e) => setAlterEgo(e.target.value)}
        />
        <button onClick={handleAddHeroClick}>Add Hero</button>
      </div>
      <button onClick={refetch}>Fetch heroes</button>
      {data?.data.map((hero) => {
        return (
          <div key={hero.id}>
            <Link to={`/rq-super-heroes/${hero.id}`}>
              {hero.id} {hero.name}
            </Link>
          </div>
        );
      })}
    </>
  );
};

export default RQSuperHeroesPage;
```

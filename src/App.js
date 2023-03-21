import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Home from "./components/Home.page";
import SuperHeroes from "./components/SuperHeroes.page";
import RQSuperHeroes from "./components/RQSuperHeroes.page";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import SuperHeroDetailPage from "./components/SuperHeroDetail.page";
import ParallelQueries from "./components/ParallelQueries.page";
import DynamicParallelQueries from "./components/DynamicParallelQueries.page";
import { DependentQueriesPage } from "./components/DependentQueriesPage";
import PaginatedQueries from "./components/PaginatedQueries.page";
import InfiniteQuery from "./components/InfiniteQueries";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/super-heroes">Traditional Super Heroes</Link>
              </li>
              <li>
                <Link to="/rq-super-heroes">RQ Super Heroes</Link>
              </li>
              <li>
                <Link to="/rq-parallel">RQ Parallel Query</Link>
              </li>
              <li>
                <Link to="/rq-dynamic-parallel">RQ Dynamic Parallel Query</Link>
              </li>
              <li>
                <Link to="/rq-dependence">RQ Dependence Parallel Query</Link>
              </li>
              <li>
                <Link to="/rq-colors">pagination colors</Link>
              </li>
              <li>
                <Link to="/rq-colors/infinite">infinite colors</Link>
              </li>
            </ul>
          </nav>
          <Routes>
            <Route path="/super-heroes" element={<SuperHeroes />}></Route>
            <Route path="/rq-parallel" element={<ParallelQueries />}></Route>
            <Route
              path="/rq-dependence"
              element={<DependentQueriesPage />}
            ></Route>
            <Route path="/rq-colors" element={<PaginatedQueries />}></Route>
            <Route
              path="/rq-colors/infinite"
              element={<InfiniteQuery />}
            ></Route>
            <Route
              path="/rq-dynamic-parallel"
              element={<DynamicParallelQueries heroeIds={[1, 4]} />}
            ></Route>
            <Route path="/rq-super-heroes" element={<RQSuperHeroes />}></Route>
            <Route
              path="/rq-super-heroes/:id"
              element={<SuperHeroDetailPage />}
            ></Route>
            <Route path="/" element={<Home />}></Route>
          </Routes>
        </div>
      </Router>
      <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
    </QueryClientProvider>
  );
}

export default App;

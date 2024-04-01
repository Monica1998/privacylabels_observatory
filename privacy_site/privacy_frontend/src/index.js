import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "bootstrap/dist/css/bootstrap.css";
import { Layout } from "./Frontend";
import { QueryClientProvider, QueryClient } from "react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {NoPage} from "./components/NoPage"

export const domain = "http://localhost:8000/"

const root = ReactDOM.createRoot(document.getElementById("root"));

// query client exists at root level of site to minimize costly fetches?
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnmount: false,
      refetchOnReconnect: false,
      retry: false,
    },
  },
});

// wrap layout object in query client provider so layout can make its fetch
const WrappedLayout = (props) =>{
  return (
    <QueryClientProvider client={queryClient}>
      < Layout {... props}/>
    </QueryClientProvider>
  )
}

// set up react router pathing
root.render(
  <BrowserRouter>
      <Routes>
        <Route path="/" element={<WrappedLayout/>}/>
          <Route path="/Browse" element={<WrappedLayout tab={0}/>}/>
          <Route path="/Browse/:id" element={<WrappedLayout tab={2}/>}/>
          <Route path="/Explanation" element={<WrappedLayout tab={1}/>}/>
          <Route path="/Search/:query" element={<WrappedLayout tab={3}/>}/>
          <Route path="/Tutorial" element={<WrappedLayout tab={4}/>}/>
          <Route path="*" element={<NoPage/>}/>
        <Route/>
      </Routes>
    </BrowserRouter>
);

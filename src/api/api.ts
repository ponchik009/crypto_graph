import { createApi } from "@reduxjs/toolkit/query/react";
import { AxiosError } from "axios";

import axiosInstance from "./axiosInstance";
import { GraphDto, Link } from "../types/graph.dto";

const axiosBaseQuery =
  ({ baseUrl } = { baseUrl: "" }) =>
  async ({
    url,
    method,
    data,
    params,
  }: {
    url: string;
    method: string;
    data?: any;
    params?: any;
  }) => {
    try {
      const result = await axiosInstance({
        url: baseUrl + url,
        method,
        data,
        params,
      });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };

export const api = createApi({
  reducerPath: "graphApi",
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    getGraphByAddress: builder.query<GraphDto, string>({
      query: (address) => ({
        url: "/messages",
        method: "post",
        data: { address },
      }),
      transformResponse: (resp: GraphDto, _, address) => {
        const newNodes = resp.nodes.map((node) => {
          const isSender =
            resp.links.reduce(
              (acc, link) =>
                link.sender === node.id ? acc + +link.usdt_amount : acc,
              0
            ) >=
            resp.links.reduce(
              (acc, link) =>
                link.receiver === node.id ? acc + +link.usdt_amount : acc,
              0
            );

          return {
            ...node,
            isMain: node.id === address,
            isSender,
            group: isSender ? "sender" : "receiver",
          };
        });

        return {
          ...resp,
          links: resp.links.map((link: Link) => ({
            ...link,
            source: link.sender,
            target: link.receiver,
            value: +link.usdt_amount,
          })),
          nodes: newNodes,
        };
      },
    }),
  }),
});

export const { useGetGraphByAddressQuery } = api;
